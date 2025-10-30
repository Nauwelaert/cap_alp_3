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


// ============================================================================
// 🚀 HYBRID CAP SERVICE IMPLEMENTATION
// ============================================================================

module.exports = class DSService extends cds.ApplicationService {
  constructor() {
    super(...arguments);
    this.dataCache = new Map();
  }

  ENTITY_CONFIG = {
    PosAnalyticsDSP: {
      apiPath: 'POS/4AM_POS_01/_4AM_POS_01(IP_START_DATE=${IP_START_DATE},IP_END_DATE=${IP_END_DATE})/Set',
      // Optional custom mapper; if omitted generic mapper is used
      map: (item, ctx) => ({
        ID: cds.utils.uuid(),
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

  buildApiUrl(template, dates) {
    return template
      .replace('${IP_START_DATE}', dates.startDate)
      .replace('${IP_END_DATE}', dates.endDate);
  }

  genericMapper(entityName, item, ctx) {
    const def = cds.entities[`DSService.${entityName}`] || cds.entities[entityName];
    const out = { ID: cds.utils.uuid(), IP_START_DATE: ctx.startDate, IP_END_DATE: ctx.endDate };
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

      this.before('READ', entityName, async (req) => {
        const { startDate, endDate } = extractDateParams(req.query, req);
        if (!startDate || !endDate) return req.error(400, 'IP_START_DATE and IP_END_DATE must be provided');

        const cacheKey = `${entityName}:${startDate}_${endDate}`;
        const cacheHit = this.dataCache.get(cacheKey);
        if (cacheHit && Date.now() - cacheHit < 300000) { // 5 min
          return; // Use cached DB contents
        }

        const cfg = this.ENTITY_CONFIG[entityName];
        const apiUrl = this.buildApiUrl(cfg.apiPath, { startDate, endDate });

        const raw = await datasphere.send('GET', apiUrl, { headers: {} });
        await DELETE.from(`DSService.${entityName}`);

        const mapped = raw.map(item =>
          (cfg.map ? cfg.map(item, { startDate, endDate }) : this.genericMapper(entityName, item, { startDate, endDate }))
        );
        if (mapped.length) {
          await INSERT.into(`DSService.${entityName}`).entries(mapped);
        }
        this.dataCache.set(cacheKey, Date.now());
      });

      this.after('READ', entityName, (data, req) => {
        const count = Array.isArray(data) ? data.length : (data ? 1 : 0);
        console.log(`[DSService] ${entityName} -> returned ${count} rows`);
        if (req.query.SELECT?.groupBy) {
          console.log('GroupBy:', req.query.SELECT.groupBy.map(g => g.ref?.[0]).join(', '));
        }
      });
    }

    await super.init();
  }
};

