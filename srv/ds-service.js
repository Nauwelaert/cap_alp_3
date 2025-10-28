const cds = require("@sap/cds");

// ============================================================================
// 🔧 UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract date parameters from deeply nested query structure
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

    if (Array.isArray(obj.where)) {
      for (let i = 0; i < obj.where.length; i++) {
        const condition = obj.where[i];
        
        if (condition?.ref?.[0] === 'IP_START_DATE') {
          if (i + 2 < obj.where.length && obj.where[i + 2]?.val) {
            const val = obj.where[i + 2].val.trim();
            if (val) {
              startDate = val;
              console.log(`Found IP_START_DATE: ${startDate}`);
            }
          }
        }
        
        if (condition?.ref?.[0] === 'IP_END_DATE') {
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

    if (obj.SELECT) queue.push(obj.SELECT);
    if (obj.from) {
      if (obj.from.SELECT) queue.push(obj.from.SELECT);
      if (obj.from.ref) queue.push(obj.from);
    }
    if (Array.isArray(obj.columns)) {
      obj.columns.forEach(col => {
        if (col.SELECT) queue.push(col.SELECT);
      });
    }
  }

  const finalStartDate = startDate?.trim() || DEFAULT_START_DATE;
  const finalEndDate = endDate?.trim() || DEFAULT_END_DATE;
  
  console.log(`Final dates - Start: ${finalStartDate}, End: ${finalEndDate}`);

  return { startDate: finalStartDate, endDate: finalEndDate };
}

/**
 * Extract WHERE filters from query (excluding date parameters)
 */
function extractWhereFilters(query) {
  const filters = {};
  const queue = [query];
  
  while (queue.length > 0) {
    const obj = queue.shift();
    
    if (!obj || typeof obj !== 'object') continue;

    if (Array.isArray(obj.where)) {
      for (let i = 0; i < obj.where.length; i++) {
        const condition = obj.where[i];
        
        if (condition?.ref?.[0] === 'IP_START_DATE' || condition?.ref?.[0] === 'IP_END_DATE') {
          continue;
        }
        
        if (condition?.ref?.[0] && i + 2 < obj.where.length && obj.where[i + 1] === '=' && obj.where[i + 2]?.val) {
          const field = condition.ref[0];
          const value = obj.where[i + 2].val;
          filters[field] = value;
          console.log(`Found filter: ${field} = ${value}`);
        }
      }
    }

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
 */
function analyzeAggregation(query) {
  const aggregateFields = new Set();
  let groupByFields = [];
  let originalGroupByFields = [];
  let hasCountOnly = false;
  let hasAggregateFunction = false;

  function search(obj) {
    if (!obj || typeof obj !== 'object') return;

    if (Array.isArray(obj.groupBy)) {
      originalGroupByFields = obj.groupBy.map(g => g.ref[0]);
      groupByFields = [...originalGroupByFields];
    }

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

    if (obj.SELECT) search(obj.SELECT);
    if (obj.from?.SELECT) search(obj.from.SELECT);
  }

  search(query);

  groupByFields = groupByFields.filter(f => f !== 'ID');

  const includesIdInGroupBy = originalGroupByFields.includes('ID');
  const isCountOnlyQuery = hasCountOnly && !hasAggregateFunction;
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
 * Map raw Datasphere data to internal structure - USING RANDOM UUID
 */
function mapDatasphereRecord(item, entityName, startDate, endDate) {
  const mapping = ENTITY_FIELD_MAPPINGS[entityName];
  
  if (!mapping) {
    throw new Error(`No field mapping defined for entity: ${entityName}`);
  }

  // Use truly random UUID
  const record = {
    ID: cds.utils.uuid()
  };

  mapping.dateFields.forEach(field => {
    if (field === 'IP_START_DATE') {
      record[field] = startDate;
    } else if (field === 'IP_END_DATE') {
      record[field] = endDate;
    } else {
      record[field] = item[field];
    }
  });

  mapping.measures.forEach(field => {
    record[field] = parseFloat(item[field]) || 0;
  });

  mapping.dimensions.forEach(field => {
    record[field] = item[field];
  });

  return record;
}

/**
 * Perform manual aggregation on data - USING RANDOM UUID
 */
function aggregateData(data, groupByFields, aggregateFields, entityName) {
  const groups = {};
  const allDimensionFields = ENTITY_FIELD_MAPPINGS[entityName]?.dimensions || [];
  
  data.forEach(item => {
    const keyParts = groupByFields.map(f => String(item[f] || 'null'));
    const key = keyParts.join('|');
    
    if (!groups[key]) {
      groups[key] = {
        ID: cds.utils.uuid() // Random UUID for aggregated records
      };
      
      allDimensionFields.forEach(field => {
        if (groupByFields.includes(field)) {
          groups[key][field] = item[field];
        } else {
          groups[key][field] = null;
        }
      });
      
      aggregateFields.forEach(field => {
        groups[key][field] = 0;
      });
    }
    
    aggregateFields.forEach(f => {
      groups[key][f] += parseFloat(item[f]) || 0;
    });
  });
  
  return Object.values(groups);
}

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

function buildODataFilter(filters) {
  if (Object.keys(filters).length === 0) return '';
  
  const filterParts = Object.entries(filters).map(([field, value]) => {
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

      const { startDate, endDate } = extractDateParams(
        req.query, 
        this.lastStartDate, 
        this.lastEndDate
      );
      
      this.lastStartDate = startDate;
      this.lastEndDate = endDate;
      console.log(`Date range: ${startDate} to ${endDate}`);

      const filters = extractWhereFilters(req.query);
      const filterString = buildODataFilter(filters);
      
      console.log('⬇️  Fetching data from Datasphere...');
      
      let apiUrl = `POS/4AM_POS_01/_4AM_POS_01(IP_START_DATE=${startDate},IP_END_DATE=${endDate})/Set`;
      
      if (filterString) {
        apiUrl += `?$filter=${encodeURIComponent(filterString)}`;
        console.log(`🔍 Applying filter to Datasphere: ${filterString}`);
      }
      
      console.log(`📡 API URL: ${apiUrl}`);

      const results = await datasphere.send("GET", apiUrl, { headers: {} });

      console.log(`✅ Retrieved ${results.length} records from Datasphere`);

      let data = results.map(item => 
        mapDatasphereRecord(item, 'PosAnalyticsDSP', startDate, endDate)
      );

      const {
        groupByFields,
        aggregateFields,
        isCountOnlyQuery,
        needsAggregation,
        isDetailLevel
      } = analyzeAggregation(req.query);

      console.log('📊 Aggregation analysis:', {
        needsAggregation,
        isCountOnlyQuery,
        isDetailLevel,
        groupByFields,
        aggregateFields
      });

      if (isDetailLevel) {
        console.log('📄 Detail-level query - returning raw records');
      } else if (needsAggregation && !isCountOnlyQuery) {
        if (groupByFields.length === 0) {
          console.log('📈 Creating grand total');
          
          const totals = { ID: cds.utils.uuid() };
          
          const allDimensionFields = ENTITY_FIELD_MAPPINGS.PosAnalyticsDSP.dimensions;
          allDimensionFields.forEach(field => {
            totals[field] = null;
          });
          
          aggregateFields.forEach(field => {
            totals[field] = data.reduce((sum, item) => 
              sum + (parseFloat(item[field]) || 0), 0
            );
          });
          
          data = [totals];
        } else {
          console.log(`📊 Aggregating by: [${groupByFields.join(', ')}]`);
          
          const beforeCount = data.length;
          data = aggregateData(data, groupByFields, aggregateFields, 'PosAnalyticsDSP');
          
          console.log(`✅ Aggregated ${beforeCount} → ${data.length} records`);
        }
      }

      console.log(`✅ Returning ${data.length} records\n`);
      return data;
    });

    await super.init();
  }
};
