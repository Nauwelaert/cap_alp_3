const cds = require("@sap/cds");

// ============================================================================
// 🔧 UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract date parameters from deeply nested query structure
 * Uses iterative depth-first search to handle arbitrary nesting
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

    // Add nested structures to queue
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
 * Map raw Datasphere data to internal structure
 */
function mapDatasphereRecord(item, startDate, endDate) {
  return {
    ID: cds.utils.uuid(),
    
    // Date fields
    IP_START_DATE: startDate,
    IP_END_DATE: endDate,
    _0CALDAY_1: item._0CALDAY_1,
    
    // Dimensions
    _0PLANT_1: item._0PLANT_1,
    _0SALESORG_1: item._0SALESORG_1,
    _0MATERIAL_1: item._0MATERIAL_1,
    _0MATERIAL_T: item._0MATERIAL_T,
    _0BASE_UOM: item._0BASE_UOM,
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
    CC_INFOPROVIDER: item.CC_INFOPROVIDER,
    
    // Measures
    CK_SALES_QUANTITY: parseFloat(item.CK_SALES_QUANTITY) || 0,
    _0RPA_CNR: parseFloat(item._0RPA_CNR) || 0,
    _0RPA_NSA: parseFloat(item._0RPA_NSA) || 0,
    _0RPA_SAT: parseFloat(item._0RPA_SAT) || 0,
    _0RPA_TAM: parseFloat(item._0RPA_TAM) || 0,
    _0RPA_TAT: parseFloat(item._0RPA_TAT) || 0,
    ZRPA_NDA: parseFloat(item.ZRPA_NDA) || 0
  };
}

// ============================================================================
// 🚀 HYBRID CAP SERVICE IMPLEMENTATION
// ============================================================================

module.exports = class DSService extends cds.ApplicationService {
  constructor() {
    super(...arguments);
    this.dataCache = new Map(); // Cache by date range
  }

  async init() {
    const datasphere = await cds.connect.to('datasphere');

    // ✅ BEFORE handler: Fetch and populate data BEFORE CAP processes query
    this.before("READ", "PosAnalyticsDSP", async (req) => {
      console.log("\n=== DSService - BEFORE READ (Data Population) ===");

      const { startDate, endDate } = extractDateParams(
        req.query, 
        this.lastStartDate, 
        this.lastEndDate
      );
      
      this.lastStartDate = startDate;
      this.lastEndDate = endDate;

      const cacheKey = `${startDate}_${endDate}`;

      // Clear cache after 5 minutes
      if (this.dataCache.has(cacheKey)) {
        const cacheTime = this.dataCache.get(cacheKey);
        if (Date.now() - cacheTime > 300000) { // 5 minutes
          this.dataCache.delete(cacheKey);
        } else {
          console.log(`✅ Using cached data for ${cacheKey}`);
          return; // Let CAP handle the query against cached data
        }
      }

      console.log(`📡 Fetching fresh data for: ${cacheKey}`);

      const apiUrl = `POS/4AM_POS_01/_4AM_POS_01(IP_START_DATE=${startDate},IP_END_DATE=${endDate})/Set`;
      const results = await datasphere.send("GET", apiUrl, { headers: {} });

      console.log(`✅ Retrieved ${results.length} records from Datasphere`);

      // Clear existing data for this entity (optional - depends on your use case)
      await DELETE.from('DSService.PosAnalyticsDSP');

      // Map and INSERT into CAP's database
      const mappedData = results.map(item => 
        mapDatasphereRecord(item, startDate, endDate)
      );

      await INSERT.into('DSService.PosAnalyticsDSP').entries(mappedData);

      // Store timestamp instead of boolean
      this.dataCache.set(cacheKey, Date.now());
      console.log(`💾 Inserted ${mappedData.length} records into CAP database`);
    });

    // ✅ AFTER handler: Log what CAP returned (optional debugging)
    this.after("READ", "PosAnalyticsDSP", (data, req) => {
      console.log(`\n✅ CAP returned ${Array.isArray(data) ? data.length : 1} aggregated records`);
      if (req.query.SELECT?.groupBy) {
        console.log(`📊 Aggregation applied: ${req.query.SELECT.groupBy.map(g => g.ref?.[0]).join(', ')}`);
      }
    });

    await super.init();
  }
};

