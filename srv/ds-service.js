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

  applySelectAndGroup(data, select) {
    if (!select) return data;
    console.log('[DSService] Incoming SELECT:', JSON.stringify(select));

    const colsDef = select.columns || [];

    const isPureAggregate = !select.groupBy?.length &&
      colsDef.length > 0 &&
      colsDef.every(c => c.func);

    // ----- Case 1: Pure aggregate (totals row) -----
    if (isPureAggregate) {
      const totals = {};
      for (const c of colsDef) {
        const func = c.func;
        const alias = c.as || `${func}_${c.args?.[0]?.ref?.[0] || 'val'}`;
        if (func === 'sum') {
          const source = c.args?.[0]?.ref?.[0];
            totals[alias] = data.reduce((acc, r) => acc + (Number(r[source]) || 0), 0);
        } else if (func === 'count') {
          // count(*) or count(1) semantics
          totals[alias] = data.length;
        } else if (func === 'min') {
          const source = c.args?.[0]?.ref?.[0];
          totals[alias] = data.reduce((acc, r) => {
            const v = Number(r[source]);
            return (isNaN(v)) ? acc : Math.min(acc, v);
          }, Number.POSITIVE_INFINITY);
          if (totals[alias] === Number.POSITIVE_INFINITY) totals[alias] = null;
        } else if (func === 'max') {
          const source = c.args?.[0]?.ref?.[0];
          totals[alias] = data.reduce((acc, r) => {
            const v = Number(r[source]);
            return (isNaN(v)) ? acc : Math.max(acc, v);
          }, Number.NEGATIVE_INFINITY);
          if (totals[alias] === Number.NEGATIVE_INFINITY) totals[alias] = null;
        } else if (func === 'avg') {
          const source = c.args?.[0]?.ref?.[0];
          let sum = 0, cnt = 0;
          for (const r of data) {
            const v = Number(r[source]);
            if (!isNaN(v)) { sum += v; cnt++; }
          }
          totals[alias] = cnt ? sum / cnt : null;
        } else {
          // Unsupported aggregation -> null
          totals[alias] = null;
        }
      }
      return [totals];
    }

    // ----- Case 2: GroupBy + aggregates -----
    if (select.groupBy && select.groupBy.length) {
      const groupKeys = select.groupBy.map(g => g.ref?.[0]).filter(Boolean);
      const aggColumns = colsDef
        .filter(c => c.func && c.args?.[0] && (c.args[0].ref || c.func === 'count'))
        .map(c => ({
          func: c.func,
          col: c.args[0].ref ? c.args[0].ref[0] : null,
          as: c.as || `${c.func}_${c.args[0].ref ? c.args[0].ref[0] : 'val'}`
        }));

      const groups = new Map();
      for (const row of data) {
        const key = groupKeys.map(k => row[k]).join('|');
        let acc = groups.get(key);
        if (!acc) {
          acc = {};
          for (const k of groupKeys) acc[k] = row[k];
          for (const a of aggColumns) {
            if (a.func === 'sum' || a.func === 'count') acc[a.as] = 0;
            if (['min','max'].includes(a.func)) acc[a.as] = undefined;
          }
          groups.set(key, acc);
        }
        for (const a of aggColumns) {
          if (a.func === 'sum') {
            acc[a.as] += Number(row[a.col]) || 0;
          } else if (a.func === 'count') {
            acc[a.as] += 1;
          } else if (a.func === 'min') {
            const v = Number(row[a.col]);
            if (!isNaN(v)) acc[a.as] = acc[a.as] === undefined ? v : Math.min(acc[a.as], v);
          } else if (a.func === 'max') {
            const v = Number(row[a.col]);
            if (!isNaN(v)) acc[a.as] = acc[a.as] === undefined ? v : Math.max(acc[a.as], v);
          } else if (a.func === 'avg') {
            // Handle avg later: store partials
            if (!acc[`__sum_${a.as}`]) { acc[`__sum_${a.as}`] = 0; acc[`__cnt_${a.as}`] = 0; }
            const v = Number(row[a.col]);
            if (!isNaN(v)) { acc[`__sum_${a.as}`] += v; acc[`__cnt_${a.as}`] += 1; }
          }
        }
      }

      // Finalize avg
      for (const acc of groups.values()) {
        for (const a of aggColumns.filter(x => x.func === 'avg')) {
          const sum = acc[`__sum_${a.as}`] || 0;
          const cnt = acc[`__cnt_${a.as}`] || 0;
          acc[a.as] = cnt ? sum / cnt : null;
          delete acc[`__sum_${a.as}`];
          delete acc[`__cnt_${a.as}`];
        }
      }
      data = Array.from(groups.values());
    }

    // ----- Projection (include refs + aggregate aliases) -----
    if (colsDef.length && !colsDef.some(c => c === '*')) {
      const cols = [];
      for (const c of colsDef) {
        if (c.ref) cols.push(c.ref[0]);
        else if (c.func) cols.push(c.as || `${c.func}_${c.args?.[0]?.ref?.[0] || 'val'}`);
      }
      data = data.map(row => {
        const o = {};
        for (const c of cols) o[c] = row[c];
        return o;
      });
    }

    return data;
  }

  async init() {
    const datasphere = await cds.connect.to('datasphere');

    for (const entityName of Object.keys(this.ENTITY_CONFIG)) {
      this.on('READ', entityName, async (req) => {
        const { startDate, endDate } = extractDateParams(req.query, req);
        if (!startDate || !endDate) return req.error(400, 'IP_START_DATE and IP_END_DATE must be provided');

        const cacheKey = `${entityName}:${startDate}_${endDate}`;
        const cached = this.memoryCache.get(cacheKey);
        let rows;

        if (cached && (Date.now() - cached.ts) < 300000) { // 5 min
          rows = cached.data;
        } else {
          const cfg = this.ENTITY_CONFIG[entityName];
          const apiUrl = this.buildApiUrl(cfg.apiPath, { startDate, endDate });
          const raw = await datasphere.send('GET', apiUrl, { headers: {} });

          rows = raw.map(item =>
            (cfg.map ? cfg.map(item, { startDate, endDate }) : this.genericMapper(entityName, item, { startDate, endDate }))
          );

          this.memoryCache.set(cacheKey, { ts: Date.now(), data: rows });
        }

        const final = this.applySelectAndGroup(rows, req.query?.SELECT);
        console.log(`[DSService] ${entityName} -> returned ${final.length} rows (no DB persistence)`);
        return final;
      });
    }

    await super.init();
  }
};

