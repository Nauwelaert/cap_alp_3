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

  // 2. Fallback: raw $apply string (if CAP didn’t translate dates yet)
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
      const { startDate, endDate } = extractDateParams(req.query, req);

      if (!startDate || !endDate) {
        req.error(400, 'IP_START_DATE and IP_END_DATE must be provided');
        return;
      }

      const rangeKey = `${startDate}_${endDate}`;

      // Clear cache after 5 minutes
      if (this.dataCache.has(rangeKey)) {
        const cacheTime = this.dataCache.get(rangeKey);
        if (Date.now() - cacheTime > 300000) { // 5 minutes
          this.dataCache.delete(rangeKey);
        } else {
          console.log(`✅ Using cached data for ${rangeKey}`);
          return; // Let CAP handle the query against cached data
        }
      }

      console.log(`📡 Fetching fresh data for: ${rangeKey}`);

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
      this.dataCache.set(rangeKey, Date.now());
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

