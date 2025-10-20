const cds = require("@sap/cds");
const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");

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

  srv.on('READ', 'PosAnalyticsDSP', async (req) => {
// get destination test
    const destination = await cds.connect.to('datasphere');
    console.log('Destination:', destination);

    // Call the external API using the destination
    const result = await executeHttpRequest(
      { destinationName: 'datasphere' },
      {
        method: 'GET',
        url: 'datasphere/consumption/analytical/POS/4AM_POS_01/_4AM_POS_01' // (IP_START_DATE=2024-12-12,IP_END_DATE=2024-12-12)/Set
      },
      headers = {
        'Accept-Language': 'nl' // should allow you to request data in a specific language'fr' or 'en'
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


// module.exports = function (srv) {
//   srv.on('READ', 'PosAnalyticsDSP', async (req) => {
//     // TEMPORARY: Skip destination and use direct API call with hardcoded token
//   const token = process.env.DATASPHERE_TOKEN; // Reads token from environment variable

//     try {
//       const response = await axios.get(
//         'https://maxedadataspherenonprod.eu30.hcs.cloud.sap/api/v1/datasphere/consumption/analytical/POS/4AM_POS_01/_4AM_POS_01(IP_START_DATE=2024-12-12,IP_END_DATE=2024-12-12)/Set'
//       );

//       const rawData = response.data?.value ?? [];

//       const mappedData = rawData.map((item) => ({
//         _0SALESORG_1: item._0SALESORG_1,
//         _0PLANT_1: item._0PLANT_1,
//         CK_SALES_QUANTITY: item.CK_SALES_QUANTITY,
//         _0RPA_SAT: item._0RPA_SAT
//       }));

//       return mappedData;
//     } catch (error) {
//       console.error("API call failed:", error.message);
//       return [];
//     }
//   });
// };