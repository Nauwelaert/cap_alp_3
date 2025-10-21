// using { AMPOS as externalPOS } from './external/AMPOS';

@path: '/base'
service DSService {

    @cds.persistence.skip
    entity PosAnalyticsDSP  {
        key ID: UUID;
        
        // Mandatory Parameters
        IP_START_DATE: Date @mandatory;
        IP_END_DATE: Date @mandatory;

        //Fact
        _0SALESORG_1: String(4);
        _0PLANT_1: String(4);
        _0MATERIAL_1: String(40);
        _0BASE_UOM: String(3);
        _0CALDAY_1: Date;
        _0CALMONTH: String(6);
        _0CALQUARTER: String(5);
        _0CALWEEK: String(6);
        _0CALYEAR: String(4);
        _0FISCPER: String(7);
        _0FISCPER3: String(3);
        _0FISCVARNT: String(2);
        _0FISCYEAR: String(4);
        _0RT_SALHOUR: String(2);
        ZSALTIME: String(6);
        _0CURRENCY: String(5);
        _0DOC_CURRCY: String(5);
        _0LOC_CURRCY: String(5);
        _0RPA_TIX: String(10);
        _0RPA_TNR: String(20);
        _0RPA_WID: String(10);
        ZTNR_DAY: String(28);
        _0RPA_WGH1: String(9);   
        _0RPA_WGH2: String(9); 
        _0RPA_WGH3: String(9);   
        _0RPA_WGH4: String(9);
        CC_INFOPROVIDER: String(7);

         // Key Figure/Measures
        CK_SALES_QUANTITY: Double;
        _0RPA_CNR: Decimal(17, 3);
        _0RPA_NSA: Decimal(17, 2);
        _0RPA_SAT: Decimal(17, 2);
        _0RPA_TAM: Decimal(17, 2);
        _0RPA_TAT: Decimal(17, 2);
        ZRPA_NDA: Decimal(17, 3);
        
        // Site
        _0ALTITUDE_Site: Decimal(17, 3);
        _0LATITUDE_Site: Decimal(15, 12);
        _0LONGITUDE_Site: Decimal(15, 12);
        _0COUNTRY_Sales_Organiza: String(3);
        _0COUNTRY_Site: String(3);
        _0COUNTY_CDE_Site: String(3);
        _0POSTAL_CD_Site: String(10);
        _0POSTCD_GIS_Site: String(10);
        _0REGION_Site: String(3);
        _0PRECISID_Site: String(4);
        _0SRCID_Site: String(4);
        _0DIVISION_Site: String(2);
        _0PURCH_ORG_Site: String(4);
        _0SALESORG_Site: String(4);
        _0SALES_DIST_Site: String(6);
        _0DISTR_CHAN_Site: String(2);
        _0LOC_CURRCY_Site: String(5);
        _0PLANTCAT_Site: String(1);
        _0APO_LOCFR_Site: String(20);
        _0BPARTNER_Site: String(10);
        _0GN_PAR_SSY_Site: String(2);
        _0FACTCAL_ID_Site: String(2);
        _0RF_DEPSTOR_Site: String(4);
        _0RF_STORETY_Site: String(1);
        _0RT_AREA_Site: String(6);
        _0RT_CUSTPL_Site: String(10);
        _0RT_LAYMD_Site: String(10);
        _0RT_LBLDATF_Site: String(8);
        _0RT_LBLDATT_Site: String(8);
        _0RT_LCLDAT_Site: String(8);
        _0RT_LOPDAT_Site: String(8);
        ZFORMAT_Site: String(1);
        ZSGRADE_Site: String(2);
        ZSTPROF_Site: String(4);
        ZSTRCONCT_Site: String(25);
        ZRCLDAT_Site: String(8);
        ZROPDAT_Site: String(8);
        ZULANG1_Site: String(2);
        ZULANG2_Site: String(2);
        ZULANG3_Site: String(2);
        ZUMAIL1_Site: String(60);
        ZUMAIL2_Site: String(60);
        ZUMAIL3_Site: String(60);
        CC_Peer_Group_1_Site: String(5);
        CC_Peer_Group_2_Site: String(5);
        CC_Peer_Group_4_Site: Integer64;
        Peer_Group_1_Site: String(4);
        _0LOGSYS_Site: String(10);
        SeqNr_Site: Integer64;
        
        // sales Organization
        
        _0COMP_CODE_Sales_Organiza: String(4);
        _0FISCVARNT_Sales_Organiza: String(2);
        _0CURRENCY_Sales_Organiza: String(5);
        _0STAT_CURR_Sales_Organiza: String(5);
        _0INT_CUST_Sales_Organiza: String(10);
        _0LOGSYS_Sales_Organiza: String(10);
        
        // Material/Article 
        
        _0DIVISION_Article: String(2);
        _0BASE_UOM_Article: String(3);
        _0CONT_UNIT_Article: String(3);
        _0NET_CONT_Article: Decimal(17, 3);
        _0MATL_CAT_Article: String(2);
        _0MATL_GROUP_Article: String(9);
        _0MATL_TYPE_Article: String(4);
        _0PROD_HIER_Article: String(18);
        _0EANUPC_Article: String(18);
        _0CREATEDON_Article: String(8);
        _0DEL_FLAG_Article: String(1);
        _0RPA_WGH1_Article: String(9);
        _0RPA_WGH2_Article: String(9);
        _0RPA_WGH3_Article: String(9);
        _0RPA_WGH4_Article: String(9);
        C_ACER006_Article: String(2);
        C_ASTY011_Article: String(4);
        C_ASTY012_Article: String(4);
        ZARTSTB_Article: String(2);
        ZARTSTB_F_Article: String(8);
        ZASSORTBC_Article: String(2);
        ZASSORTBD_Article: String(2);
        ZASSORTBE_Article: String(2);
        ZASSORTBL_Article: String(2);
        ZASSORTBR_Article: String(2);
        ZASSORTPL_Article: String(2);
        ZBKLUS_Article: String(1);
        ZBRAND_ID_Article: String(4);
        ZDISTP_Article: String(3);
        ZIMPORT_Article: String(1);
        ZLOCART_Article: String(1);
        ZMATL_EN_Article: String(40);
        ZMATL_FR_Article: String(40);
        ZMATL_NL_Article: String(40);
        ZMFRNR_Article: String(10);
        ZOLDMAT_Article: String(18);
        ZORDRANST_Article: String(1);
        ZPDEPT_Article: String(2);
        ZPGROUP_Article: String(3);
        ZPLEINAIR_Article: String(1);
        ZPPSLARGE_Article: String(1);
        _0RT_PRBAND_Article: String(2);
        _0SR_COMMDTY_Article: String(40);
        ZSORTBC_Article: String(10);
        ZSORTBD_Article: String(10);
        ZSORTBE_Article: String(10);
        ZSORTBL_Article: String(10);
        ZSORTBR_Article: String(10);
        ZSORTPL_Article: String(10);
        _0LOGSYS_Article: String(10);
        
        // Calendar & Time Dimensions

        CALMONTH_Calendar_Day: String(6);
        CALQUARTER_Calendar_Day: String(5);
        CALWEEK_Calendar_Day: String(6);
        DATE_SAP_Calendar_Day: String(8);
        DAY_OF_WEEK_Calendar_Day: String(2);
        MONTH_Calendar_Day: String(2);
        QUARTER_Calendar_Day: String(2);
        YEAR_Calendar_Day: String(4);
           
    }; 

};