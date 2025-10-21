const cds = require("@sap/cds");
const { retrieveJwt } = require("@sap-cloud-sdk/core");

module.exports = class DSService extends cds.ApplicationService {
  async init() {
    const { connect } = cds;
    const datasphere = await cds.connect.to('datasphere');

    // Add middleware to check authentication
    // this.before('*', (req) => {
    //   console.log("=== Authentication Debug ===");
    //   console.log("Auth headers:", req.headers.authorization ? "Present" : "Missing");
    //   console.log("User:", req.user ? req.user.id : "Anonymous");
    //   console.log("All headers:", JSON.stringify(req.headers, null, 2));
    //   console.log("Request path:", req.path);
    //   console.log("===========================");
    // });

    this.on("READ", "PosAnalyticsDSP", async(req) => {

      console.log("DSService - PosAnalyticsDSP request received");

      // Extract JWT from incoming request
      const jwt = retrieveJwt(req);
      // console.log("JWT retrieved:", jwt ? "Yes" : "No");

      // parameters uitlezen
      const { IP_START_DATE = '2024-12-14', IP_END_DATE = '2024-12-14' } = req.params ?? {};
      // request naar datasphere sturen

      const results = await datasphere.send(
        "GET", `POS/4AM_POS_01/_4AM_POS_01(IP_START_DATE=${IP_START_DATE},IP_END_DATE=${IP_END_DATE})/Set`,
      {
          headers: {
            //'Accept-Language': 'nl'
          }
        }
 
      
      );
      // 

      console.log("Handling PosAnalyticsDSP request");
     
      

// Map Datasphere response to PosAnalyticsDSP structure
      const mappedResults = results.map(item => ({
        ID: cds.utils.uuid(),
        IP_START_DATE,
        IP_END_DATE,
        
        // Key Figures / Measures
        CK_SALES_QUANTITY: item.CK_SALES_QUANTITY,
        _0RPA_CNR: item._0RPA_CNR,
        _0RPA_NSA: item._0RPA_NSA,
        _0RPA_SAT: item._0RPA_SAT,
        _0RPA_TAM: item._0RPA_TAM,
        _0RPA_TAT: item._0RPA_TAT,
        ZRPA_NDA: item.ZRPA_NDA,
        
        // Article Fields
        _0BASE_UOM_Article: item._0BASE_UOM_Article,
        _0CONT_UNIT_Article: item._0CONT_UNIT_Article,
        _0NET_CONT_Article: item._0NET_CONT_Article,
        _0MATL_CAT_Article: item._0MATL_CAT_Article,
        _0MATL_GROUP_Article: item._0MATL_GROUP_Article,
        _0MATL_TYPE_Article: item._0MATL_TYPE_Article,
        _0PROD_HIER_Article: item._0PROD_HIER_Article,
        _0EANUPC_Article: item._0EANUPC_Article,
        _0CREATEDON_Article: item._0CREATEDON_Article,
        _0DEL_FLAG_Article: item._0DEL_FLAG_Article,
        _0DIVISION_Article: item._0DIVISION_Article,
        _0LOGSYS_Article: item._0LOGSYS_Article,
        _0RPA_WGH1_Article: item._0RPA_WGH1_Article,
        _0RPA_WGH2_Article: item._0RPA_WGH2_Article,
        _0RPA_WGH3_Article: item._0RPA_WGH3_Article,
        _0RPA_WGH4_Article: item._0RPA_WGH4_Article,
        _0RT_PRBAND_Article: item._0RT_PRBAND_Article,
        _0SR_COMMDTY_Article: item._0SR_COMMDTY_Article,
        C_ACER006_Article: item.C_ACER006_Article,
        C_ASTY011_Article: item.C_ASTY011_Article,
        C_ASTY012_Article: item.C_ASTY012_Article,
        ZARTSTB_Article: item.ZARTSTB_Article,
        ZARTSTB_F_Article: item.ZARTSTB_F_Article,
        ZASSORTBC_Article: item.ZASSORTBC_Article,
        ZASSORTBD_Article: item.ZASSORTBD_Article,
        ZASSORTBE_Article: item.ZASSORTBE_Article,
        ZASSORTBL_Article: item.ZASSORTBL_Article,
        ZASSORTBR_Article: item.ZASSORTBR_Article,
        ZASSORTPL_Article: item.ZASSORTPL_Article,
        ZBKLUS_Article: item.ZBKLUS_Article,
        ZBRAND_ID_Article: item.ZBRAND_ID_Article,
        ZDISTP_Article: item.ZDISTP_Article,
        ZIMPORT_Article: item.ZIMPORT_Article,
        ZLOCART_Article: item.ZLOCART_Article,
        ZMATL_EN_Article: item.ZMATL_EN_Article,
        ZMATL_FR_Article: item.ZMATL_FR_Article,
        ZMATL_NL_Article: item.ZMATL_NL_Article,
        ZMFRNR_Article: item.ZMFRNR_Article,
        ZOLDMAT_Article: item.ZOLDMAT_Article,
        ZORDRANST_Article: item.ZORDRANST_Article,
        ZPDEPT_Article: item.ZPDEPT_Article,
        ZPGROUP_Article: item.ZPGROUP_Article,
        ZPLEINAIR_Article: item.ZPLEINAIR_Article,
        ZPPSLARGE_Article: item.ZPPSLARGE_Article,
        ZSORTBC_Article: item.ZSORTBC_Article,
        ZSORTBD_Article: item.ZSORTBD_Article,
        ZSORTBE_Article: item.ZSORTBE_Article,
        ZSORTBL_Article: item.ZSORTBL_Article,
        ZSORTBR_Article: item.ZSORTBR_Article,
        ZSORTPL_Article: item.ZSORTPL_Article,
        
        // Site Fields
        _0PLANT_1: item._0PLANT_1,
        _0ALTITUDE_Site: item._0ALTITUDE_Site,
        _0LATITUDE_Site: item._0LATITUDE_Site,
        _0LONGITUDE_Site: item._0LONGITUDE_Site,
        _0COUNTRY_Site: item._0COUNTRY_Site,
        _0COUNTY_CDE_Site: item._0COUNTY_CDE_Site,
        _0POSTAL_CD_Site: item._0POSTAL_CD_Site,
        _0POSTCD_GIS_Site: item._0POSTCD_GIS_Site,
        _0REGION_Site: item._0REGION_Site,
        _0PRECISID_Site: item._0PRECISID_Site,
        _0SRCID_Site: item._0SRCID_Site,
        _0SALESORG_Site: item._0SALESORG_Site,
        _0SALES_DIST_Site: item._0SALES_DIST_Site,
        _0DISTR_CHAN_Site: item._0DISTR_CHAN_Site,
        _0DIVISION_Site: item._0DIVISION_Site,
        _0PURCH_ORG_Site: item._0PURCH_ORG_Site,
        _0PLANTCAT_Site: item._0PLANTCAT_Site,
        _0LOGSYS_Site: item._0LOGSYS_Site,
        _0APO_LOCFR_Site: item._0APO_LOCFR_Site,
        _0BPARTNER_Site: item._0BPARTNER_Site,
        _0GN_PAR_SSY_Site: item._0GN_PAR_SSY_Site,
        _0FACTCAL_ID_Site: item._0FACTCAL_ID_Site,
        _0RF_DEPSTOR_Site: item._0RF_DEPSTOR_Site,
        _0RF_STORETY_Site: item._0RF_STORETY_Site,
        _0RT_AREA_Site: item._0RT_AREA_Site,
        _0RT_CUSTPL_Site: item._0RT_CUSTPL_Site,
        _0RT_LAYMD_Site: item._0RT_LAYMD_Site,
        _0RT_LBLDATF_Site: item._0RT_LBLDATF_Site,
        _0RT_LBLDATT_Site: item._0RT_LBLDATT_Site,
        _0RT_LCLDAT_Site: item._0RT_LCLDAT_Site,
        _0RT_LOPDAT_Site: item._0RT_LOPDAT_Site,
        ZFORMAT_Site: item.ZFORMAT_Site,
        ZSGRADE_Site: item.ZSGRADE_Site,
        ZSTPROF_Site: item.ZSTPROF_Site,
        ZSTRCONCT_Site: item.ZSTRCONCT_Site,
        ZRCLDAT_Site: item.ZRCLDAT_Site,
        ZROPDAT_Site: item.ZROPDAT_Site,
        ZULANG1_Site: item.ZULANG1_Site,
        ZULANG2_Site: item.ZULANG2_Site,
        ZULANG3_Site: item.ZULANG3_Site,
        ZUMAIL1_Site: item.ZUMAIL1_Site,
        ZUMAIL2_Site: item.ZUMAIL2_Site,
        ZUMAIL3_Site: item.ZUMAIL3_Site,
        CC_Peer_Group_1_Site: item.CC_Peer_Group_1_Site,
        CC_Peer_Group_2_Site: item.CC_Peer_Group_2_Site,
        CC_Peer_Group_4_Site: item.CC_Peer_Group_4_Site,
        Peer_Group_1_Site: item.Peer_Group_1_Site,
        SeqNr_Site: item.SeqNr_Site,
        _0LOC_CURRCY_Site: item._0LOC_CURRCY_Site,
        
        // Sales Organization Fields
        _0SALESORG_1: item._0SALESORG_1,
        _0COMP_CODE_Sales_Organiza: item._0COMP_CODE_Sales_Organiza,
        _0COUNTRY_Sales_Organiza: item._0COUNTRY_Sales_Organiza,
        _0CURRENCY_Sales_Organiza: item._0CURRENCY_Sales_Organiza,
        _0FISCVARNT_Sales_Organiza: item._0FISCVARNT_Sales_Organiza,
        _0LOGSYS_Sales_Organiza: item._0LOGSYS_Sales_Organiza,
        _0INT_CUST_Sales_Organiza: item._0INT_CUST_Sales_Organiza,
        _0STAT_CURR_Sales_Organiza: item._0STAT_CURR_Sales_Organiza,
        
        // Calendar Day Fields
        CALMONTH_Calendar_Day: item.CALMONTH_Calendar_Day,
        CALQUARTER_Calendar_Day: item.CALQUARTER_Calendar_Day,
        CALWEEK_Calendar_Day: item.CALWEEK_Calendar_Day,
        DATE_SAP_Calendar_Day: item.DATE_SAP_Calendar_Day,
        DAY_OF_WEEK_Calendar_Day: item.DAY_OF_WEEK_Calendar_Day,
        MONTH_Calendar_Day: item.MONTH_Calendar_Day,
        QUARTER_Calendar_Day: item.QUARTER_Calendar_Day,
        YEAR_Calendar_Day: item.YEAR_Calendar_Day,
        
        // Other Dimension Fields
        _0MATERIAL_1: item._0MATERIAL_1,
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

      return mappedResults;
      
    });
  }
}

