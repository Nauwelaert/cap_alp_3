const cds = require("@sap/cds");

// ============================================================================
// 🔧 UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract date parameters from deeply nested query structure
 * Uses iterative depth-first search to handle arbitrary nesting
 */
function extractDateParams(query, req) {
  let startDate, endDate;

  // 1. Direct CQN WHERE (from $filter or $apply filter)
  const scanWhere = (whereArr) => {
    if (!Array.isArray(whereArr)) return;
    for (let i = 0; i < whereArr.length; i++) {
      const token = whereArr[i];
      if (token?.ref?.[0] === 'IP_START_DATE' && whereArr[i + 1] === '=' && whereArr[i + 2]?.val) {
        startDate = whereArr[i + 2].val;
      }
      if (token?.ref?.[0] === 'IP_END_DATE' && whereArr[i + 1] === '=' && whereArr[i + 2]?.val) {
        endDate = whereArr[i + 2].val;
      }
    }
  };

  // BFS through query object to find any where arrays
  const queue = [query];
  while (queue.length) {
    const obj = queue.shift();
    if (!obj || typeof obj !== 'object') continue;
    if (Array.isArray(obj.where)) scanWhere(obj.where);
    for (const k in obj) {
      const v = obj[k];
      if (v && typeof v === 'object') queue.push(v);
    }
  }

  // 2. Fallback: raw $apply string (if CAP didn't translate dates yet)
  if ((!startDate || !endDate) && req?._?.req?.query?.$apply) {
    const applyStr = req._.req.query.$apply;
    const m = applyStr.match(/IP_START_DATE\s+eq\s+(\d{4}-\d{2}-\d{2}).*IP_END_DATE\s+eq\s+(\d{4}-\d{2}-\d{2})/);
    if (m) {
      startDate = startDate || m[1];
      endDate = endDate || m[2];
    }
  }

  // 3. Fallback: plain query parameters (?IP_START_DATE=...&IP_END_DATE=...)
  if (!startDate && req?._?.req?.query?.IP_START_DATE) startDate = req._.req.query.IP_START_DATE;
  if (!endDate && req?._?.req?.query?.IP_END_DATE) endDate = req._.req.query.IP_END_DATE;

  return { startDate, endDate };
}

/**
 * Get entity definition and validate it exists
 */
function getEntityDefinition(entityName) {
  return cds.entities[`DSService.${entityName}`] || cds.entities[entityName];
}

/**
 * Check if a field exists in the entity definition
 */
function fieldExistsInEntity(fieldName, entityDef) {
  if (!entityDef || !entityDef.elements) return false;
  return fieldName in entityDef.elements;
}

/**
 * Get all measure fields from entity definition
 */
function getMeasureFields(entityName) {
  const measures = new Set();
  const def = getEntityDefinition(entityName);
  
  if (def) {
    Object.entries(def.elements).forEach(([name, element]) => {
      // Measures are typically numeric types and not parameters
      if (['Double', 'Decimal', 'Integer', 'Int64'].includes(element.type) &&
          name !== 'ID' && 
          name !== 'IP_START_DATE' && 
          name !== 'IP_END_DATE') {
        measures.add(name);
      }
    });
  }
  
  return measures;
}

/**
 * Recursively extract all field references from any nested query structure
 */
function extractAllRefs(obj, excludedFields, collected = new Set()) {
  if (!obj || typeof obj !== 'object') return collected;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    obj.forEach(item => extractAllRefs(item, excludedFields, collected));
    return collected;
  }
  
  // Check if this object has a ref
  if (obj.ref && Array.isArray(obj.ref)) {
    const fieldName = obj.ref[0];
    if (fieldName && !excludedFields.includes(fieldName)) {
      collected.add(fieldName);
    }
  }
  
  // Check for function arguments
  if (obj.func && obj.args) {
    extractAllRefs(obj.args, excludedFields, collected);
  }
  
  // Recursively check all properties
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      extractAllRefs(obj[key], excludedFields, collected);
    }
  }
  
  return collected;
}

/**
 * Extract requested fields from the query, including measures and aggregations
 * ALWAYS includes all measures to ensure API can aggregate them
 * Only includes fields that actually exist in the entity definition
 */
function extractRequestedFields(query, entityName, req) {
  const fields = new Set();
  const excludedFields = ['ID', 'IP_START_DATE', 'IP_END_DATE']; // ID is CAP-only, not in Datasphere
  
  console.log('[DSService] Full request object:', JSON.stringify({
    query: query,
    rawQuery: req?._?.req?.query
  }, null, 2));
  
  // Get entity definition for validation
  const entityDef = getEntityDefinition(entityName);
  if (!entityDef) {
    console.warn(`[DSService] Entity definition not found for: ${entityName}`);
    return [];
  }
  
  // 1. Get all measures first - these should ALWAYS be included
  const measures = getMeasureFields(entityName);
  console.log('[DSService] Entity measures:', Array.from(measures));
  
  // 2. Recursively extract ALL field references from the entire query structure
  const referencedFields = extractAllRefs(query, excludedFields);
  console.log('[DSService] Fields referenced in query:', Array.from(referencedFields));
  
  // 3. Check $apply string for additional fields
  const applyStr = req?._?.req?.query?.$apply;
  if (applyStr) {
    console.log('[DSService] $apply string:', applyStr);
    
    // Extract fields from groupby(...)
    const groupbyMatch = applyStr.match(/groupby\(\((.*?)\)/);
    if (groupbyMatch) {
      groupbyMatch[1].split(',').forEach(field => {
        const trimmed = field.trim();
        if (trimmed && !excludedFields.includes(trimmed)) {
          referencedFields.add(trimmed);
        }
      });
    }
    
    // Extract measures from aggregate(...)
    const aggregateMatch = applyStr.match(/aggregate\((.*?)\)/);
    if (aggregateMatch) {
      // Parse patterns like: CK_SALES_QUANTITY with sum as CK_SALES_QUANTITY
      const aggFields = aggregateMatch[1].match(/(\w+)\s+with\s+\w+\s+as\s+\w+/g);
      if (aggFields) {
        aggFields.forEach(match => {
          const fieldMatch = match.match(/^(\w+)\s+with/);
          if (fieldMatch && !excludedFields.includes(fieldMatch[1])) {
            referencedFields.add(fieldMatch[1]);
          }
        });
      }
    }
  }
  
  // 4. Validate referenced fields exist in entity
  const validReferencedFields = new Set();
  referencedFields.forEach(field => {
    if (fieldExistsInEntity(field, entityDef)) {
      validReferencedFields.add(field);
    } else {
      console.warn(`[DSService] Field '${field}' referenced but does not exist in entity '${entityName}' - excluding from $select`);
    }
  });
  
  // 5. Combine: Start with valid referenced fields (dimensions)
  validReferencedFields.forEach(field => fields.add(field));
  
  // 6. ALWAYS add all measures - they're needed for aggregation (already validated during extraction)
  measures.forEach(measure => fields.add(measure));
  
  const result = Array.from(fields);
  console.log('[DSService] Final $select fields (validated dimensions + ALL measures):', result);
  return result;
}

/**
 * Build $select query parameter from requested fields
 */
function buildSelectClause(requestedFields) {
  if (!requestedFields || requestedFields.length === 0) return '';
  return `$select=${requestedFields.join(',')}`;
}

// ============================================================================
// 🚀 HYBRID CAP SERVICE IMPLEMENTATION (NO INTERNAL DB PERSISTENCE)
// ============================================================================

module.exports = class DSService extends cds.ApplicationService {
  constructor() {
    super(...arguments);
    // Regular in-memory cache: key -> { ts, data }
    this.memoryCache = new Map();
  }

  ENTITY_CONFIG = {
    PosAnalyticsDSP: {
      apiPath: 'POS/4AM_POS_01/_4AM_POS_01(IP_START_DATE=${IP_START_DATE},IP_END_DATE=${IP_END_DATE})/Set',
      // Optional custom mapper; if omitted generic mapper is used
      map: (item, ctx) => ({
        ID: cds.utils.uuid(), // Generated by CAP, not from Datasphere
        IP_START_DATE: ctx.startDate,
        IP_END_DATE: ctx.endDate,
        _0PLANT_1: item._0PLANT_1,
        _0SALESORG_1: item._0SALESORG_1,
        CK_SALES_QUANTITY: parseFloat(item.CK_SALES_QUANTITY) || 0,
        _0RPA_SAT: parseFloat(item._0RPA_SAT) || 0
      })
    },
    // Add more entities here:
    // AnotherEntity: { apiPath: 'POS/XYZ(...)/Set' }
  };

  buildApiUrl(template, dates, selectClause) {
    let url = template
      .replace('${IP_START_DATE}', dates.startDate)
      .replace('${IP_END_DATE}', dates.endDate);
    
    if (selectClause) {
      url += url.includes('?') ? `&${selectClause}` : `?${selectClause}`;
    }
    
    return url;
  }

  genericMapper(entityName, item, ctx) {
    const def = getEntityDefinition(entityName);
    const out = { 
      ID: cds.utils.uuid(), // Always generate ID - it's CAP-only
      IP_START_DATE: ctx.startDate, 
      IP_END_DATE: ctx.endDate 
    };
    if (!def) return out;
    
    for (const [el, meta] of Object.entries(def.elements)) {
      if (out[el] !== undefined) continue;
      if (el === 'ID' || el === 'IP_START_DATE' || el === 'IP_END_DATE') continue;
      const v = item[el];
      if (v == null) continue;
      // Simple numeric detection (extend if needed)
      if (['Double','Decimal','Integer','Int64'].includes(meta?.type)) {
        out[el] = parseFloat(v) || 0;
      } else {
        out[el] = v;
      }
    }
    return out;
  }

  async init() {
    const datasphere = await cds.connect.to('datasphere');

    for (const entityName of Object.keys(this.ENTITY_CONFIG)) {
      this.on('READ', entityName, async (req) => {
        const { startDate, endDate } = extractDateParams(req.query, req);
        if (!startDate || !endDate) return req.error(400, 'IP_START_DATE and IP_END_DATE must be provided');

        // Extract fields: dimensions from request + ALL measures (validated against entity)
        const requestedFields = extractRequestedFields(req.query, entityName, req);
        const selectClause = buildSelectClause(requestedFields);
        
        const cacheKey = `${entityName}:${startDate}_${endDate}:${selectClause}`;
        const cached = this.memoryCache.get(cacheKey);
        let rows;

        if (cached && (Date.now() - cached.ts) < 300000) { // 5 min
          rows = cached.data;
        } else {
          const cfg = this.ENTITY_CONFIG[entityName];
          const apiUrl = this.buildApiUrl(cfg.apiPath, { startDate, endDate }, selectClause);
          console.log(`[DSService] Fetching from API: ${apiUrl}`);
          
          const raw = await datasphere.send('GET', apiUrl, { headers: {} });

          // Map and add CAP-specific fields (ID, dates)
          rows = raw.map(item =>
            (cfg.map ? cfg.map(item, { startDate, endDate }) : this.genericMapper(entityName, item, { startDate, endDate }))
          );

          this.memoryCache.set(cacheKey, { ts: Date.now(), data: rows });
        }

        console.log(`[DSService] ${entityName} -> returned ${rows.length} rows (API-side aggregation, validated fields)`);
        return rows;
      });
    }

    await super.init();
  }
};

