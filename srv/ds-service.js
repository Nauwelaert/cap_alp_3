const cds = require("@sap/cds");
const { retrieveJwt } = require("@sap-cloud-sdk/core");

// Helper function to extract date parameters from query
function extractDateParams(query, previousStartDate = null, previousEndDate = null) {
  const DEFAULT_START_DATE = '2024-10-14';
  const DEFAULT_END_DATE = '2024-10-14';
  
  let startDate = previousStartDate;
  let endDate = previousEndDate;

  // Iterative depth-first search using a queue
  const queue = [query];
  let depth = 0;
  
  while (queue.length > 0) {
    const currentLevelSize = queue.length;
    let foundAtThisLevel = false;
    
    // Process all items at current depth level
    for (let i = 0; i < currentLevelSize; i++) {
      const obj = queue.shift();
      
      if (!obj || typeof obj !== 'object') continue;

      // Check if current object has a WHERE clause
      if (obj.where && Array.isArray(obj.where)) {
        // Parse WHERE clause which can be in format: [ref, "=", val, "and", ref, "=", val]
        for (let j = 0; j < obj.where.length; j++) {
          const condition = obj.where[j];
          
          // Check if this is a ref object
          if (condition && condition.ref && Array.isArray(condition.ref)) {
            const fieldName = condition.ref[0];
            
            // Look ahead for the value (should be at j+2 after the "=" operator)
            if (fieldName === 'IP_START_DATE' && j + 2 < obj.where.length) {
              const valueObj = obj.where[j + 2];
              if (valueObj && valueObj.val && valueObj.val.trim() !== '') {
                startDate = valueObj.val;
                foundAtThisLevel = true;
                console.log('Found IP_START_DATE in WHERE:', startDate);
              }
            }
            
            if (fieldName === 'IP_END_DATE' && j + 2 < obj.where.length) {
              const valueObj = obj.where[j + 2];
              if (valueObj && valueObj.val && valueObj.val.trim() !== '') {
                endDate = valueObj.val;
                foundAtThisLevel = true;
                console.log('Found IP_END_DATE in WHERE:', endDate);
              }
            }
          }
        }
      }

      // Add nested structures to queue for next depth level
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
          if (col.SELECT) {
            queue.push(col.SELECT);
          }
          if (col.as && typeof col.as === 'object') {
            queue.push(col.as);
          }
        });
      }
    }
    
    depth++;
    console.log(`Searched at depth ${depth}, found dates: ${foundAtThisLevel}`);
    
    // Stop if queue is empty (no more nested structures)
    if (queue.length === 0) {
      console.log(`Reached maximum depth: ${depth}`);
      break;
    }
  }

  // Apply defaults if still empty or null
  if (!startDate || startDate.trim() === '') {
    startDate = DEFAULT_START_DATE;
    console.log(`Using default start date: ${startDate}`);
  }
  if (!endDate || endDate.trim() === '') {
    endDate = DEFAULT_END_DATE;
    console.log(`Using default end date: ${endDate}`);
  }

  return { startDate, endDate };
}

// Helper function to perform manual aggregation
function aggregateData(data, groupByFields, aggregateFields) {
  const groups = {};
  
  data.forEach(item => {
    // Create grouping key
    const key = groupByFields.map(field => item[field] || '').join('|');
    
    if (!groups[key]) {
      // Initialize group with dimension values and zero measures
      groups[key] = {
        ID: cds.utils.uuid()
      };
      
      // Add groupBy fields
      groupByFields.forEach(field => {
        groups[key][field] = item[field];
      });
      
      // Initialize aggregate fields to 0
      aggregateFields.forEach(field => {
        groups[key][field] = 0;
      });
    }
    
    // Sum the aggregate fields
    aggregateFields.forEach(field => {
      groups[key][field] += parseFloat(item[field]) || 0;
    });
  });
  
  return Object.values(groups);
}

module.exports = class DSService extends cds.ApplicationService {
  constructor() {
    super(...arguments);
    this.lastStartDate = null;
    this.lastEndDate = null;
    this.rawDataCache = new Map();
  }

  async init() {
    const { connect } = cds;
    const datasphere = await cds.connect.to('datasphere');

    this.on("READ", "PosAnalyticsDSP", async(req) => {

      console.log("DSService - PosAnalyticsDSP ON handler");
      console.log('Request query:', JSON.stringify(req.query, null, 2));
      
      // Extract date parameters using helper function
      const { startDate, endDate } = extractDateParams(
        req.query, 
        this.lastStartDate, 
        this.lastEndDate
      );

      this.lastStartDate = startDate;
      this.lastEndDate = endDate;

      console.log(`Using dates - Start: ${startDate}, End: ${endDate}`);

      const cacheKey = `${startDate}|${endDate}`;
      
      // Fetch raw data (cache it to avoid repeated calls)
      if (!this.rawDataCache.has(cacheKey)) {
        console.log('Fetching data from Datasphere...');
        
        const results = await datasphere.send(
          "GET", `POS/4AM_POS_01/_4AM_POS_01(IP_START_DATE=${startDate},IP_END_DATE=${endDate})/Set`,
          {
            headers: {}
          }
        );

        console.log(`Retrieved ${results.length} records from Datasphere`);
        
        if (results.length > 0) {
          console.log('Sample raw record from Datasphere:', JSON.stringify(results[0], null, 2));
        }

        // Map to internal structure
        const mappedResults = results.map(item => ({
          ID: cds.utils.uuid(),
          IP_START_DATE: startDate,
          IP_END_DATE: endDate,
          
          // Key Figures / Measures
          CK_SALES_QUANTITY: parseFloat(item.CK_SALES_QUANTITY) || 0,
          _0RPA_CNR: parseFloat(item._0RPA_CNR) || 0,
          _0RPA_NSA: parseFloat(item._0RPA_NSA) || 0,
          _0RPA_SAT: parseFloat(item._0RPA_SAT) || 0,
          _0RPA_TAM: parseFloat(item._0RPA_TAM) || 0,
          _0RPA_TAT: parseFloat(item._0RPA_TAT) || 0,
          ZRPA_NDA: parseFloat(item.ZRPA_NDA) || 0,

          // Dimensions
          _0PLANT_1: item._0PLANT_1,
          _0SALESORG_1: item._0SALESORG_1,
          _0MATERIAL_1: item._0MATERIAL_1,
          _0MATERIAL_T: item._0MATERIAL_T,
          _0BASE_UOM: item._0BASE_UOM,
          _0CALDAY_1: item._0CALDAY_1,
          _0CALMONTH: item._0CALMONTH,
          _0CALQUARTER: item._0CALQUARTER,
          _0CALWEEK: item._0CALWEEK,
          _0CALYEAR: item._0CALYEAR,
          _0FISCPER: item._0FISCPER,
          _0FISCPER3: item._0FISCPER3,
          _0FISCVARNT: item._0FISCVARNT,
          _0FISCYEAR: item._0FISCYEAR,
          _0RT_SALHOUR: item._0RT_SALHOUR,
          ZSALTIME: item.ZSALTIME,
          _0CURRENCY: item._0CURRENCY,
          _0DOC_CURRCY: item._0DOC_CURRCY,
          _0LOC_CURRCY: item._0LOC_CURRCY,
          _0RPA_TIX: item._0RPA_TIX,
          _0RPA_TNR: item._0RPA_TNR,
          _0RPA_WID: item._0RPA_WID,
          ZTNR_DAY: item.ZTNR_DAY,
          _0RPA_WGH1: item._0RPA_WGH1,
          _0RPA_WGH2: item._0RPA_WGH2,
          _0RPA_WGH3: item._0RPA_WGH3,
          _0RPA_WGH4: item._0RPA_WGH4,
          CC_INFOPROVIDER: item.CC_INFOPROVIDER
        }));
        
        this.rawDataCache.set(cacheKey, mappedResults);
        console.log(`Cached ${mappedResults.length} raw records`);
      } else {
        console.log('Using cached raw data');
      }
      
      let data = this.rawDataCache.get(cacheKey);
      
      // Check if aggregation is needed
      const hasGroupBy = req.query.SELECT && req.query.SELECT.groupBy;
      
      if (hasGroupBy) {
        console.log('Aggregation required - performing manual aggregation');
        
        // Extract groupBy field names
        const groupByFields = req.query.SELECT.groupBy.map(g => g.ref[0]);
        console.log('GroupBy fields:', groupByFields);
        
        // Define which fields to aggregate (measures)
        const aggregateFields = [
          'CK_SALES_QUANTITY',
          '_0RPA_SAT',
          '_0RPA_CNR',
          '_0RPA_NSA',
          '_0RPA_TAM',
          '_0RPA_TAT',
          'ZRPA_NDA'
        ];
        
        // Perform aggregation
        data = aggregateData(data, groupByFields, aggregateFields);
        
        console.log(`Aggregated from ${this.rawDataCache.get(cacheKey).length} to ${data.length} records`);
        if (data.length > 0) {
          console.log('Sample aggregated record:', JSON.stringify(data[0], null, 2));
        }
      }
      
      console.log(`Returning ${data.length} records`);
      return data;
    });
  }
}
