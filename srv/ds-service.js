const cds = require("@sap/cds");

// ============================================================================
// 🔧 UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract date parameters from deeply nested query structure
 * Uses iterative depth-first search to handle arbitrary nesting
 * Required as fiori sends multiple requests with nested select and thus also where statements at different levels
 * different function for data param as required. 
 */
function extractDateParams(query, previousStartDate = null, previousEndDate = null) {
  const DEFAULT_START_DATE = '2024-10-14';
  const DEFAULT_END_DATE = '2024-10-14';
  
  let startDate = previousStartDate;
  let endDate = previousEndDate;

  const queue = [query];
  
  while (queue.length > 0) {
    const obj = queue.shift();
    
    if (!obj || typeof obj !== 'object') continue;

    // Check WHERE clause at current level
    if (Array.isArray(obj.where)) {
      for (let i = 0; i < obj.where.length; i++) {
        const condition = obj.where[i];
        
        // Look for IP_START_DATE
        if (condition?.ref?.[0] === 'IP_START_DATE') {
          // Value should be 2 positions ahead (after '=' operator)
          if (i + 2 < obj.where.length && obj.where[i + 2]?.val) {
            const val = obj.where[i + 2].val.trim();
            if (val) {
              startDate = val;
              console.log(`Found IP_START_DATE: ${startDate}`);
            }
          }
        }
        
        // Look for IP_END_DATE
        if (condition?.ref?.[0] === 'IP_END_DATE') {
          // Value should be 2 positions ahead (after '=' operator)
          if (i + 2 < obj.where.length && obj.where[i + 2]?.val) {
            const val = obj.where[i + 2].val.trim();
            if (val) {
              endDate = val;
              console.log(`Found IP_END_DATE: ${endDate}`);
            }
          }
        }
      }
    }

    // Add nested structures to queue - MUST process all levels
    if (obj.SELECT) {
      queue.push(obj.SELECT);
    }
    
    if (obj.from) {
      if (obj.from.SELECT) {
        queue.push(obj.from.SELECT);
      }
      if (obj.from.ref) {
        queue.push(obj.from);
      }
    }
    
    if (Array.isArray(obj.columns)) {
      obj.columns.forEach(col => {
        if (col.SELECT) queue.push(col.SELECT);
      });
    }
  }

  // Use defaults only if still not found
  const finalStartDate = startDate?.trim() || DEFAULT_START_DATE;
  const finalEndDate = endDate?.trim() || DEFAULT_END_DATE;
  
  console.log(`Final dates - Start: ${finalStartDate}, End: ${finalEndDate}`);

  return {
    startDate: finalStartDate,
    endDate: finalEndDate
  };
}

/**
 * Extract WHERE filters from query (excluding date parameters)
 * Returns an object with field-value pairs for filtering
 */
function extractWhereFilters(query) {
  const filters = {};
  const queue = [query];
  
  while (queue.length > 0) {
    const obj = queue.shift();
    
    if (!obj || typeof obj !== 'object') continue;

    // Check WHERE clause at current level
    if (Array.isArray(obj.where)) {
      for (let i = 0; i < obj.where.length; i++) {
        const condition = obj.where[i];
        
        // Skip date parameters (handled separately)
        if (condition?.ref?.[0] === 'IP_START_DATE' || condition?.ref?.[0] === 'IP_END_DATE') {
          continue;
        }
        
        // Look for field = value patterns
        if (condition?.ref?.[0] && i + 2 < obj.where.length && obj.where[i + 1] === '=' && obj.where[i + 2]?.val) {
          const field = condition.ref[0];
          const value = obj.where[i + 2].val;
          filters[field] = value;
          console.log(`Found filter: ${field} = ${value}`);
        }
      }
    }

    // Add nested structures to queue
    if (obj.SELECT) queue.push(obj.SELECT);
    if (obj.from) {
      if (obj.from.SELECT) queue.push(obj.from.SELECT);
      if (obj.from.ref) queue.push(obj.from);
    }
  }

  return filters;
}

/**
 * Analyze query to determine aggregation requirements
 * Returns groupBy fields, aggregate fields, and query type flags
 */
function analyzeAggregation(query) {
  const aggregateFields = new Set();
  let groupByFields = [];
  let originalGroupByFields = [];
  let hasCountOnly = false;
  let hasAggregateFunction = false;

  function search(obj) {
    if (!obj || typeof obj !== 'object') return;

    // Find groupBy
    if (Array.isArray(obj.groupBy)) {
      originalGroupByFields = obj.groupBy.map(g => g.ref[0]);
      groupByFields = [...originalGroupByFields];
    }

    // Find aggregate functions
    if (Array.isArray(obj.columns)) {
      obj.columns.forEach(col => {
        if (col.func === 'count') {
          hasCountOnly = true;
        } else if (['sum', 'avg'].includes(col.func)) {
          hasAggregateFunction = true;
          const field = col.args?.[0]?.ref?.[0];
          if (field) aggregateFields.add(field);
        }
      });
    }

    // Recurse
    if (obj.SELECT) search(obj.SELECT);
    if (obj.from?.SELECT) search(obj.from.SELECT);
  }

  search(query);

  // Filter out ID from groupBy
  groupByFields = groupByFields.filter(f => f !== 'ID');

  const includesIdInGroupBy = originalGroupByFields.includes('ID');
  
  // A query is count-only if it ONLY has count and no other aggregate functions
  const isCountOnlyQuery = hasCountOnly && !hasAggregateFunction;
  
  // Determine if this is detail-level or aggregation:
  // - Detail level: ID is in groupBy (user wants to see individual records)
  // - Aggregation level: ID is NOT in groupBy (user wants aggregated totals)
  const hasDimensionFields = groupByFields.length > 0;
  const isDetailLevel = includesIdInGroupBy;
  const needsAggregation = hasAggregateFunction && !isDetailLevel;

  return {
    groupByFields,
    aggregateFields: Array.from(aggregateFields),
    isCountOnlyQuery,
    includesIdInGroupBy,
    needsAggregation,
    hasAggregateFunction,
    hasDimensionFields,
    isDetailLevel
  };
}

/**
 * Perform manual aggregation on data
 * Groups by specified fields and sums measures
 * Keeps all dimension fields, setting non-grouped ones to null for proper hierarchy
 */
function aggregateData(data, groupByFields, aggregateFields, entityName) {
  const groups = {};
  
  // Get all dimension fields from entity mapping
  const allDimensionFields = ENTITY_FIELD_MAPPINGS[entityName]?.dimensions || [];
  
  data.forEach(item => {
    const key = groupByFields.map(f => item[f] || '').join('|');
    
    if (!groups[key]) {
      groups[key] = {
        ID: cds.utils.uuid()
      };
      
      // Add ALL dimension fields
      // Fields in groupBy get their values, others get null
      allDimensionFields.forEach(field => {
        if (groupByFields.includes(field)) {
          groups[key][field] = item[field];
        } else {
          groups[key][field] = null;
        }
      });
      
      // Initialize aggregate fields to 0
      aggregateFields.forEach(field => {
        groups[key][field] = 0;
      });
    }
    
    // Sum the aggregate fields
    aggregateFields.forEach(f => {
      groups[key][f] += parseFloat(item[f]) || 0;
    });
  });
  
  return Object.values(groups);
}

/**
 * Define static field mapping for entity
 * This should be entity-specific and define all fields, required for aggregation
 * if new entity is required this is where to add it.
 * Then implement the logic in the CAP service handler. 
 */
const ENTITY_FIELD_MAPPINGS = {
  PosAnalyticsDSP: {
    dateFields: ['IP_START_DATE', 'IP_END_DATE', '_0CALDAY_1'],
    measures: [
      'CK_SALES_QUANTITY',
      '_0RPA_CNR',
      '_0RPA_NSA',
      '_0RPA_SAT',
      '_0RPA_TAM',
      '_0RPA_TAT',
      'ZRPA_NDA'
    ],
    dimensions: [
      '_0PLANT_1',
      '_0SALESORG_1',
      '_0MATERIAL_1',
      '_0MATERIAL_T',
      '_0BASE_UOM',
      '_0CALMONTH',
      '_0CALQUARTER',
      '_0CALWEEK',
      '_0CALYEAR',
      '_0FISCPER',
      '_0FISCPER3',
      '_0FISCVARNT',
      '_0FISCYEAR',
      '_0RT_SALHOUR',
      'ZSALTIME',
      '_0CURRENCY',
      '_0DOC_CURRCY',
      '_0LOC_CURRCY',
      '_0RPA_TIX',
      '_0RPA_TNR',
      '_0RPA_WID',
      'ZTNR_DAY',
      '_0RPA_WGH1',
      '_0RPA_WGH2',
      '_0RPA_WGH3',
      '_0RPA_WGH4',
      'CC_INFOPROVIDER'
    ]
  }
};

/**
 * Map raw Datasphere data to internal structure
 * Always maps ALL fields to ensure aggregation works at any level
 */
function mapDatasphereRecord(item, entityName, startDate, endDate) {
  const mapping = ENTITY_FIELD_MAPPINGS[entityName];
  
  if (!mapping) {
    throw new Error(`No field mapping defined for entity: ${entityName}`);
  }

  const record = {
    ID: cds.utils.uuid()
  };

  // Map date fields
  mapping.dateFields.forEach(field => {
    if (field === 'IP_START_DATE') {
      record[field] = startDate;
    } else if (field === 'IP_END_DATE') {
      record[field] = endDate;
    } else {
      record[field] = item[field];
    }
  });

  // Map measures (ensure numeric)
  mapping.measures.forEach(field => {
    record[field] = parseFloat(item[field]) || 0;
  });

  // Map dimensions
  mapping.dimensions.forEach(field => {
    record[field] = item[field];
  });

  return record;
}

/**
 * Build OData filter string for Datasphere API
 */
function buildODataFilter(filters) {
  if (Object.keys(filters).length === 0) return '';
  
  const filterParts = Object.entries(filters).map(([field, value]) => {
    // Handle string values with quotes
    if (typeof value === 'string') {
      return `${field} eq '${value}'`;
    }
    return `${field} eq ${value}`;
  });
  
  return filterParts.join(' and ');
}

// ============================================================================
// 🚀 CAP SERVICE IMPLEMENTATION
// ============================================================================

module.exports = class DSService extends cds.ApplicationService {
  constructor() {
    super(...arguments);
    this.lastStartDate = null;
    this.lastEndDate = null;
  }

  async init() {
    const datasphere = await cds.connect.to('datasphere');

    this.on("READ", "PosAnalyticsDSP", async (req) => {
      console.log("\n=== DSService - PosAnalyticsDSP Request ===");

      // 📅 Extract date parameters
      const { startDate, endDate } = extractDateParams(
        req.query, 
        this.lastStartDate, 
        this.lastEndDate
      );
      
      this.lastStartDate = startDate;
      this.lastEndDate = endDate;
      console.log(`Date range: ${startDate} to ${endDate}`);

      // 🔍 Extract filters
      const filters = extractWhereFilters(req.query);
      
      // 📦 Fetch data from Datasphere (NO CACHING)
      console.log('⬇️  Fetching data from Datasphere...');
      
      // Build OData URL with filters
      let apiUrl = `POS/4AM_POS_01/_4AM_POS_01(IP_START_DATE=${startDate},IP_END_DATE=${endDate})/Set`;
      
      // Add $filter query parameter if filters exist
      const filterString = buildODataFilter(filters);
      if (filterString) {
        apiUrl += `?$filter=${encodeURIComponent(filterString)}`;
        console.log(`🔍 Applying filter to Datasphere: ${filterString}`);
      }
      
      console.log(`📡 API URL: ${apiUrl}`);

      const results = await datasphere.send(
        "GET",
        apiUrl,
        { headers: {} }
      );

      console.log(`✅ Retrieved ${results.length} records from Datasphere`);

      // Map ALL fields (not just query fields) to support any aggregation level
      let data = results.map(item => 
        mapDatasphereRecord(item, 'PosAnalyticsDSP', startDate, endDate)
      );

      // 📊 Analyze query for aggregation needs
      const {
        groupByFields,
        aggregateFields,
        isCountOnlyQuery,
        includesIdInGroupBy,
        needsAggregation,
        hasAggregateFunction,
        hasDimensionFields,
        isDetailLevel
      } = analyzeAggregation(req.query);

      console.log('📊 Aggregation analysis:', {
        needsAggregation,
        isCountOnlyQuery,
        includesIdInGroupBy,
        hasAggregateFunction,
        hasDimensionFields,
        isDetailLevel,
        groupByFields,
        aggregateFields
      });

      // 🔄 Perform aggregation or return detail data
      if (isDetailLevel) {
        console.log('📄 Detail-level query detected (ID in groupBy) - returning raw records');
        // Return all raw records as-is for detail view
      } else if (needsAggregation && !isCountOnlyQuery) {
        if (groupByFields.length === 0) {
          console.log('📈 Creating grand total (no groupBy)');
          
          const totals = { ID: cds.utils.uuid() };
          
          // Set all dimensions to null for grand total
          const allDimensionFields = ENTITY_FIELD_MAPPINGS.PosAnalyticsDSP.dimensions;
          allDimensionFields.forEach(field => {
            totals[field] = null;
          });
          
          // Sum all aggregate fields
          aggregateFields.forEach(field => {
            totals[field] = data.reduce((sum, item) => 
              sum + (parseFloat(item[field]) || 0), 0
            );
          });
          
          data = [totals];
          console.log('Grand total:', totals);
        } else {
          console.log(`📊 Aggregating by: [${groupByFields.join(', ')}]`);
          
          const beforeCount = data.length;
          data = aggregateData(data, groupByFields, aggregateFields, 'PosAnalyticsDSP');
          
          console.log(`✅ Aggregated ${beforeCount} → ${data.length} records`);
          if (data.length > 0) {
            console.log('Sample:', JSON.stringify(data[0], null, 2));
          }
        }
      } else if (isCountOnlyQuery) {
        console.log('🔢 Count-only query - returning data as-is for counting');
      } else {
        console.log('📄 No aggregation - returning raw records');
      }

      console.log(`✅ Returning ${data.length} records\n`);
      return data;
    });

    await super.init();
  }
};
