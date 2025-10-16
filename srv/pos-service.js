const cds = require("@sap/cds");
const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");
const axios = require("axios");

srv.before('READ', 'PosAnalyticsDSP', (req) => {
      // Load environment variables if VCAP_SERVICES is not set to see if present for local testing 
    if (!process.env.VCAP_SERVICES) {
      xsenv.loadEnv();
      console.log("No VCAP services:  "+xsenv.loadEnv())
    }
    else {
      console.log("VCAP services found:  "+process.env.VCAP_SERVICES) 
    }
  });

module.exports = function (srv) {
  srv.on('READ', 'PosAnalyticsDSP', async (req) => {
// get destination test
    const destination = await cds.connect.to('datasphere');
    console.log('Destination:', destination);

    // Call the external API using the destination
    const result = await executeHttpRequest(
      { destinationName: 'datasphere' },
      {
        method: 'GET',
        url: 'datasphere/consumption/analytical/POS/4AM_POS_01/_4AM_POS_01(IP_START_DATE=2024-12-12,IP_END_DATE=2024-12-12)/Set'
      }
    );

    const rawData = result.data?.value ?? [];

    const mappedData = rawData.map((item) => ({
      _0SALESORG_1: item._0SALESORG_1,
      _0PLANT_1: item._0PLANT_1,
      CK_SALES_QUANTITY: item.CK_SALES_QUANTITY,
      _0RPA_SAT: item._0RPA_SAT
    }));

    return mappedData;
  });
};