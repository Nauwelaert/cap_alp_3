const cds = require("@sap/cds");

module.exports = class DSService extends cds.ApplicationService {
  async init() {
    const { connect } = cds;
    const datasphere = await cds.connect.to('datasphere');

    this.on("READ", "PosAnalyticsDSP", async(req) => {

      // parameters uitlezen
      const { IP_START_DATE = '2024-12-14', IP_END_DATE = '2024-12-14' } = req.params ?? {};
      // request naar datasphere sturen

      // ds api that returns results: https://maxedadataspherenonprod.eu30.hcs.cloud.sap/api/v1/datasphere/consumption/analytical/POS/4AM_POS_01/_4AM_POS_01(IP_START_DATE=2024-10-14,IP_END_DATE=2024-10-14)/Set
      const results = await datasphere.send(
        "GET", `_4AM_POS_01(IP_START_DATE=${IP_START_DATE},IP_END_DATE=${IP_END_DATE})/Set`
      );
      // 

      console.log("Handling PosAnalyticsDSP request");
     
      

// Map Datasphere response to PosAnalyticsDSP structure
      const mappedResults = results.map(item => ({
        ID: cds.utils.uuid(),
        IP_START_DATE,
        IP_END_DATE,
        _0SALESORG_1: item._0SALESORG_1,
        _0PLANT_1: item._0PLANT_1,
        CK_SALES_QUANTITY: item.CK_SALES_QUANTITY,
        _0RPA_SAT: item._0RPA_SAT
      }));

      return mappedResults;
      
    });
  }
}

