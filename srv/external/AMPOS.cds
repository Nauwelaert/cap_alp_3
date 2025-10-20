/* checksum : b8231dd5a1295ab085fb07c1a20684f9 */
@cds.external : true
service AMPOS {
  @cds.external : true
  @cds.persistence.skip : true
  @Common.Label : 'POS POC model'
  @DataIntegration.OriginalName : '4AM_POS_01'
  entity _4AM_POS_01Type {
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0ALTITUDE_Site'
    @Common.Label : 'Geographical Height'
    _0ALTITUDE_Site : Decimal(17, 3);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0APO_LOCFR_Site'
    @Common.Label : 'APO Start Location'
    _0APO_LOCFR_Site : String(20);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0BASE_UOM'
    @Common.Label : 'Base Unit'
    @Common.IsUnit : true
    _0BASE_UOM : String(3);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0BASE_UOM_Article'
    @Common.Label : 'Base Unit'
    @Common.IsUnit : true
    _0BASE_UOM_Article : String(3);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0BPARTNER_Site'
    @Common.Label : 'Business Partner'
    _0BPARTNER_Site : String(10);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0CALDAY'
    @Common.Label : 'Calendar Day'
    _0CALDAY_1 : Date;
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0CALMONTH'
    @Common.Label : 'Calendar Year/Month'
    @Common.IsCalendarYearMonth : true
    _0CALMONTH : String(6);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0CALQUARTER'
    @Common.Label : 'Calendar Year/Quarter'
    @Common.IsCalendarYearQuarter : true
    _0CALQUARTER : String(5);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0CALWEEK'
    @Common.Label : 'Calendar Year/Week'
    @Common.IsCalendarYearWeek : true
    _0CALWEEK : String(6);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0CALYEAR'
    @Common.Label : 'Calendar Year'
    @Common.IsCalendarYear : true
    _0CALYEAR : String(4);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0COMP_CODE_Sales_Organiza'
    @Common.Label : 'Company code'
    _0COMP_CODE_Sales_Organiza : String(4);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0CONT_UNIT_Article'
    @Common.Label : 'Content unit'
    @Common.IsUnit : true
    _0CONT_UNIT_Article : String(3);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0COUNTRY_Sales_Organiza'
    @Common.Label : 'Country'
    _0COUNTRY_Sales_Organiza : String(3);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0COUNTRY_Site'
    @Common.Label : 'Country'
    _0COUNTRY_Site : String(3);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0COUNTY_CDE_Site'
    @Common.Label : 'County Code'
    _0COUNTY_CDE_Site : String(3);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0CREATEDON_Article'
    @Common.Label : 'Created on'
    _0CREATEDON_Article : String(8);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0CURRENCY'
    @Common.Label : 'Currency'
    @Common.IsCurrency : true
    _0CURRENCY : String(5);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0CURRENCY_Sales_Organiza'
    @Common.Label : 'Currency'
    @Common.IsCurrency : true
    _0CURRENCY_Sales_Organiza : String(5);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0DEL_FLAG_Article'
    @Common.Label : 'Deletion flag'
    _0DEL_FLAG_Article : String(1);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0DISTR_CHAN_Site'
    @Common.Label : 'Distribution Channel'
    _0DISTR_CHAN_Site : String(2);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0DIVISION_Article'
    @Common.Label : 'Division'
    _0DIVISION_Article : String(2);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0DIVISION_Site'
    @Common.Label : 'Division'
    _0DIVISION_Site : String(2);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0DOC_CURRCY'
    @Common.Label : 'Document currency'
    @Common.IsCurrency : true
    _0DOC_CURRCY : String(5);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0EANUPC_Article'
    @Common.Label : 'EAN/UPC'
    _0EANUPC_Article : String(18);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0FACTCAL_ID_Site'
    @Common.Label : 'Factory Calendar ID'
    _0FACTCAL_ID_Site : String(2);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0FISCPER'
    @Common.Label : 'Fiscal year / period'
    @Common.IsFiscalYearPeriod : true
    _0FISCPER : String(7);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0FISCPER3'
    @Common.Label : 'Posting period'
    @Common.IsFiscalPeriod : true
    _0FISCPER3 : String(3);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0FISCVARNT'
    @Common.Label : 'Fiscal Year Variant'
    @Common.IsFiscalYearVariant : true
    _0FISCVARNT : String(2);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0FISCVARNT_Sales_Organiza'
    @Common.Label : 'Fiscal Year Variant'
    @Common.IsFiscalYearVariant : true
    _0FISCVARNT_Sales_Organiza : String(2);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0FISCYEAR'
    @Common.Label : 'Fiscal year'
    @Common.IsFiscalYear : true
    _0FISCYEAR : String(4);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0GN_PAR_SSY_Site'
    @Common.Label : 'Partner Srce System'
    _0GN_PAR_SSY_Site : String(2);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0INT_CUST_Sales_Organiza'
    @Common.Label : 'Customer Number for Internal Settlement'
    _0INT_CUST_Sales_Organiza : String(10);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0LATITUDE_Site'
    @Common.Label : 'Latitude'
    _0LATITUDE_Site : Decimal(15, 12);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0LOC_CURRCY'
    @Common.Label : 'Local currency'
    @Common.IsCurrency : true
    _0LOC_CURRCY : String(5);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0LOC_CURRCY_Site'
    @Common.Label : 'Local currency'
    @Common.IsCurrency : true
    _0LOC_CURRCY_Site : String(5);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0LOGSYS_Article'
    @Common.Label : 'Source System'
    _0LOGSYS_Article : String(10);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0LOGSYS_Sales_Organiza'
    @Common.Label : 'Source System'
    _0LOGSYS_Sales_Organiza : String(10);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0LOGSYS_Site'
    @Common.Label : 'Source System'
    _0LOGSYS_Site : String(10);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0LONGITUDE_Site'
    @Common.Label : 'Longitude'
    _0LONGITUDE_Site : Decimal(15, 12);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0MATERIAL'
    @Common.Label : 'Article'
    _0MATERIAL_1 : String(40);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0MATL_CAT_Article'
    @Common.Label : 'Article Category'
    _0MATL_CAT_Article : String(2);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0MATL_GROUP_Article'
    @Common.Label : 'Merchandise Category'
    _0MATL_GROUP_Article : String(9);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0MATL_TYPE_Article'
    @Common.Label : 'Article Type'
    _0MATL_TYPE_Article : String(4);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0NET_CONT_Article'
    @Common.Label : 'Net contents'
    _0NET_CONT_Article : Decimal(17, 3);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0PLANT'
    @Common.Label : 'Site'
    _0PLANT_1 : String(4);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0PLANTCAT_Site'
    @Common.Label : 'Site Category'
    _0PLANTCAT_Site : String(1);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0POSTAL_CD_Site'
    @Common.Label : 'Postal Code'
    _0POSTAL_CD_Site : String(10);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0POSTCD_GIS_Site'
    @Common.Label : 'CAM:PstCde(Geo-Rel.)'
    _0POSTCD_GIS_Site : String(10);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0PRECISID_Site'
    @Common.Label : 'Geo-precision'
    _0PRECISID_Site : String(4);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0PROD_HIER_Article'
    @Common.Label : 'Prod.hierarchy'
    _0PROD_HIER_Article : String(18);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0PURCH_ORG_Site'
    @Common.Label : 'Purchasing org.'
    _0PURCH_ORG_Site : String(4);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0REGION_Site'
    @Common.Label : 'Region'
    _0REGION_Site : String(3);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RF_DEPSTOR_Site'
    @Common.Label : 'Superor. Dept. Store'
    _0RF_DEPSTOR_Site : String(4);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RF_STORETY_Site'
    @Common.Label : 'Store Category'
    _0RF_STORETY_Site : String(1);
    @Common.Label : 'Nr.of Tickets'
    @Analytics.measure : true
    @DataIntegration.OriginalName : '0RPA_CNR'
    _0RPA_CNR : Decimal(17, 3);
    @Common.Label : 'Normal Sales Value'
    @Analytics.measure : true
    @DataIntegration.OriginalName : '0RPA_NSA'
    @Measures.ISOCurrency : ![0DOC_CURRCY]
    _0RPA_NSA : Decimal(17, 2);
    @Common.Label : 'Sales RetVal'
    @Analytics.measure : true
    @DataIntegration.OriginalName : '0RPA_SAT'
    @Measures.ISOCurrency : ![0DOC_CURRCY]
    _0RPA_SAT : Decimal(17, 2);
    @Common.Label : 'Tax Amount'
    @Analytics.measure : true
    @DataIntegration.OriginalName : '0RPA_TAM'
    @Measures.ISOCurrency : ![0DOC_CURRCY]
    _0RPA_TAM : Decimal(17, 2);
    @Common.Label : 'Tender Value'
    @Analytics.measure : true
    @DataIntegration.OriginalName : '0RPA_TAT'
    @Measures.ISOCurrency : ![0DOC_CURRCY]
    _0RPA_TAT : Decimal(17, 2);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RPA_TIX'
    @Common.Label : 'Transaction Index'
    _0RPA_TIX : String(10);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RPA_TNR'
    @Common.Label : 'Transaction Number'
    _0RPA_TNR : String(20);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RPA_WGH1'
    @Common.Label : 'Subfamily'
    _0RPA_WGH1 : String(9);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RPA_WGH1_Article'
    @Common.Label : 'Subfamily'
    _0RPA_WGH1_Article : String(9);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RPA_WGH2'
    @Common.Label : 'Department'
    _0RPA_WGH2 : String(9);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RPA_WGH2_Article'
    @Common.Label : 'Department'
    _0RPA_WGH2_Article : String(9);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RPA_WGH3'
    @Common.Label : 'Product group'
    _0RPA_WGH3 : String(9);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RPA_WGH3_Article'
    @Common.Label : 'Product group'
    _0RPA_WGH3_Article : String(9);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RPA_WGH4'
    @Common.Label : 'DIY'
    _0RPA_WGH4 : String(9);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RPA_WGH4_Article'
    @Common.Label : 'DIY'
    _0RPA_WGH4_Article : String(9);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RPA_WID'
    @Common.Label : 'POS Number'
    _0RPA_WID : String(10);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RT_AREA_Site'
    @Common.Label : 'Sales Area'
    _0RT_AREA_Site : String(6);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RT_CUSTPL_Site'
    @Common.Label : 'Site Customer No.'
    _0RT_CUSTPL_Site : String(10);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RT_LAYMD_Site'
    @Common.Label : 'Store size'
    _0RT_LAYMD_Site : String(10);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RT_LBLDATF_Site'
    @Common.Label : 'Store Lock Time (fr)'
    _0RT_LBLDATF_Site : String(8);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RT_LBLDATT_Site'
    @Common.Label : 'Store Lock Time (to)'
    _0RT_LBLDATT_Site : String(8);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RT_LCLDAT_Site'
    @Common.Label : 'Store Closing Date'
    _0RT_LCLDAT_Site : String(8);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RT_LOPDAT_Site'
    @Common.Label : 'Store Opening Date'
    _0RT_LOPDAT_Site : String(8);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RT_PRBAND_Article'
    @Common.Label : 'Price Band Category'
    _0RT_PRBAND_Article : String(2);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0RT_SALHOUR'
    @Common.Label : 'Hour of Sale'
    _0RT_SALHOUR : String(2);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0SALESORG'
    @Common.Label : 'Sales Organization'
    _0SALESORG_1 : String(4);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0SALESORG_Site'
    @Common.Label : 'Sales Organization'
    _0SALESORG_Site : String(4);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0SALES_DIST_Site'
    @Common.Label : 'Sales District'
    _0SALES_DIST_Site : String(6);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0SRCID_Site'
    @Common.Label : 'DatSrc.ID of GeoLoct'
    _0SRCID_Site : String(4);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0SR_COMMDTY_Article'
    @Common.Label : 'Commodity'
    _0SR_COMMDTY_Article : String(40);
    @Analytics.Dimension : true
    @DataIntegration.OriginalName : '0STAT_CURR_Sales_Organiza'
    @Common.Label : 'Statist. curr.'
    @Common.IsCurrency : true
    _0STAT_CURR_Sales_Organiza : String(5);
    @Analytics.Dimension : true
    @Common.Label : 'Calendar Month'
    @Common.IsCalendarYearMonth : true
    CALMONTH_Calendar_Day : String(6);
    @Analytics.Dimension : true
    @Common.Label : 'Calendar Quarter'
    @Common.IsCalendarYearQuarter : true
    CALQUARTER_Calendar_Day : String(5);
    @Analytics.Dimension : true
    @Common.Label : 'Calendar Week'
    @Common.IsCalendarYearWeek : true
    CALWEEK_Calendar_Day : String(6);
    @Analytics.Dimension : true
    @Common.Label : 'InfoProvider'
    CC_INFOPROVIDER : String(7);
    @Analytics.Dimension : true
    @Common.Label : 'Peer Group 1'
    CC_Peer_Group_1_Site : String(5);
    @Analytics.Dimension : true
    @Common.Label : 'Peer Group 2'
    CC_Peer_Group_2_Site : String(5);
    @Analytics.Dimension : true
    @Common.Label : 'Peer Group 4'
    CC_Peer_Group_4_Site : Integer64;
    @Common.Label : 'Sales Quantity'
    @Analytics.measure : true
    CK_SALES_QUANTITY : Double;
    @Common.Label : 'Sales Quantity no dim'
    @UI.Hidden : true
    @Analytics.measure : true
    @DataIntegration.OriginalName : 'CK_SALES_QUAN_Nââaaa'
    CK_SALES_QUAN_N__aaa : Decimal;
    @Analytics.Dimension : true
    @Common.Label : 'Certification'
    C_ACER006_Article : String(2);
    @Analytics.Dimension : true
    @Common.Label : 'Style/trend group -'
    C_ASTY011_Article : String(4);
    @Analytics.Dimension : true
    @Common.Label : 'Style/trend group'
    C_ASTY012_Article : String(4);
    @Analytics.Dimension : true
    @Common.Label : 'Date (String)'
    @Common.IsCalendarDate : true
    DATE_SAP_Calendar_Day : String(8);
    @Analytics.Dimension : true
    @Common.Label : 'Day of Week'
    @Common.IsDayOfCalendarYear : true
    DAY_OF_WEEK_Calendar_Day : String(2);
    @Analytics.Dimension : true
    @Common.Label : 'Month'
    @Common.IsCalendarMonth : true
    MONTH_Calendar_Day : String(2);
    @Analytics.Dimension : true
    @Common.Label : 'Peer Group 3'
    Peer_Group_1_Site : String(4);
    @Analytics.Dimension : true
    @Common.Label : 'Quarter'
    QUARTER_Calendar_Day : String(2);
    @Analytics.Dimension : true
    @Common.Label : 'SeqNr'
    SeqNr_Site : Integer64;
    @Analytics.Dimension : true
    @Common.Label : 'Year'
    @Common.IsCalendarYear : true
    YEAR_Calendar_Day : String(4);
    @Analytics.Dimension : true
    @Common.Label : 'Art. Stat. (Basic)'
    ZARTSTB_Article : String(2);
    @Analytics.Dimension : true
    @Common.Label : 'Art.Stat.(B) Val.Fr.'
    ZARTSTB_F_Article : String(8);
    @Analytics.Dimension : true
    @Common.Label : 'Ass. Cityshop'
    ZASSORTBC_Article : String(2);
    @Analytics.Dimension : true
    @Common.Label : 'Ass. Briko Depot'
    ZASSORTBD_Article : String(2);
    @Analytics.Dimension : true
    @Common.Label : 'Ass. E-Shop'
    ZASSORTBE_Article : String(2);
    @Analytics.Dimension : true
    @Common.Label : 'Ass. Brico Lux.'
    ZASSORTBL_Article : String(2);
    @Analytics.Dimension : true
    @Common.Label : 'Ass. Brico'
    ZASSORTBR_Article : String(2);
    @Analytics.Dimension : true
    @Common.Label : 'Ass. Plan-it'
    ZASSORTPL_Article : String(2);
    @Analytics.Dimension : true
    @Common.Label : 'Assortment Praxis'
    ZBKLUS_Article : String(1);
    @Analytics.Dimension : true
    @Common.Label : 'Brand'
    ZBRAND_ID_Article : String(4);
    @Analytics.Dimension : true
    @Common.Label : 'Distribution profile'
    ZDISTP_Article : String(3);
    @Analytics.Dimension : true
    @Common.Label : 'Format'
    ZFORMAT_Site : String(1);
    @Analytics.Dimension : true
    @Common.Label : 'Import'
    ZIMPORT_Article : String(1);
    @Analytics.Dimension : true
    @Common.Label : 'Loc Article'
    ZLOCART_Article : String(1);
    @Analytics.Dimension : true
    @Common.Label : 'Article desc. EN'
    ZMATL_EN_Article : String(40);
    @Analytics.Dimension : true
    @Common.Label : 'Article desc. FR'
    ZMATL_FR_Article : String(40);
    @Analytics.Dimension : true
    @Common.Label : 'Article desc. NL'
    ZMATL_NL_Article : String(40);
    @Analytics.Dimension : true
    @Common.Label : 'Manufacturer'
    ZMFRNR_Article : String(10);
    @Analytics.Dimension : true
    @Common.Label : 'Old article number'
    ZOLDMAT_Article : String(18);
    @Analytics.Dimension : true
    @Common.Label : 'Ord Ranst'
    ZORDRANST_Article : String(1);
    @Analytics.Dimension : true
    @Common.Label : 'Praxis Department'
    ZPDEPT_Article : String(2);
    @Analytics.Dimension : true
    @Common.Label : 'Praxis Group'
    ZPGROUP_Article : String(3);
    @Analytics.Dimension : true
    @Common.Label : 'Plein Air'
    ZPLEINAIR_Article : String(1);
    @Analytics.Dimension : true
    @Common.Label : 'PPS large'
    ZPPSLARGE_Article : String(1);
    @Analytics.Dimension : true
    @Common.Label : 'Renovation: Closed'
    ZRCLDAT_Site : String(8);
    @Analytics.Dimension : true
    @Common.Label : 'Renovation: Opened'
    ZROPDAT_Site : String(8);
    @Common.Label : '#Art/Ticket'
    @Analytics.measure : true
    ZRPA_NDA : Decimal(17, 3);
    @Analytics.Dimension : true
    @Common.Label : 'Sales Time'
    ZSALTIME : String(6);
    @Analytics.Dimension : true
    @Common.Label : 'Store Grade'
    ZSGRADE_Site : String(2);
    @Analytics.Dimension : true
    @Common.Label : 'Sortcode Cityshop'
    ZSORTBC_Article : String(10);
    @Analytics.Dimension : true
    @Common.Label : 'Sortcode Briko Depot'
    ZSORTBD_Article : String(10);
    @Analytics.Dimension : true
    @Common.Label : 'Sortcode E-shop'
    ZSORTBE_Article : String(10);
    @Analytics.Dimension : true
    @Common.Label : 'Sortcode Brico Lux.'
    ZSORTBL_Article : String(10);
    @Analytics.Dimension : true
    @Common.Label : 'Sortcode Brico'
    ZSORTBR_Article : String(10);
    @Analytics.Dimension : true
    @Common.Label : 'Sortcode Plan-it'
    ZSORTPL_Article : String(10);
    @Analytics.Dimension : true
    @Common.Label : 'Store type'
    ZSTPROF_Site : String(4);
    @Analytics.Dimension : true
    @Common.Label : 'Store Concept'
    ZSTRCONCT_Site : String(25);
    @Analytics.Dimension : true
    @Common.Label : 'Transaction Barcode'
    ZTNR_DAY : String(28);
    @Analytics.Dimension : true
    @Common.Label : 'Reporting Language 1'
    ZULANG1_Site : String(2);
    @Analytics.Dimension : true
    @Common.Label : 'Reporting Language 2'
    ZULANG2_Site : String(2);
    @Analytics.Dimension : true
    @Common.Label : 'Reporting Language 3'
    ZULANG3_Site : String(2);
    @Analytics.Dimension : true
    @Common.Label : 'E-mail adress 1'
    ZUMAIL1_Site : String(60);
    @Analytics.Dimension : true
    @Common.Label : 'E-mail adress 2'
    ZUMAIL2_Site : String(60);
    @Analytics.Dimension : true
    @Common.Label : 'E-mail adress 3'
    ZUMAIL3_Site : String(60);
    @Analytics.Dimension : true
    _0CALDAY : Date;
    @Analytics.Dimension : true
    _0MATERIAL : LargeString;
    @Analytics.Dimension : true
    _0PLANT : LargeString;
    @Analytics.Dimension : true
    _0SALESORG : LargeString;
    @Analytics.navigationAttributeRef : [ '_0CALDAY', 'DAY_INT' ]
    @DataIntegration.OriginalName : '0CALDAYâT'
    @Common.Label : 'Day (Number)'
    @Common.TextFor : '_0CALDAY'
    _0CALDAY_T : Integer;
    @Analytics.navigationAttributeRef : [ '_0SALESORG', '_1VT_0COUN', 'TXTSH' ]
    @DataIntegration.OriginalName : '0COUNTRY_Sales_OrganizaâT'
    @Common.Label : 'Country Salesorg Description'
    @Common.TextFor : '0COUNTRY_Sales_Organiza'
    _0COUNTRY_Sales_Organiza_T : String(20);
    @Analytics.navigationAttributeRef : [ '_0PLANT', '_1VT_0COUN', 'TXTSH' ]
    @DataIntegration.OriginalName : '0COUNTRY_SiteâT'
    @Common.Label : 'Country Plant Description'
    @Common.TextFor : '0COUNTRY_Site'
    _0COUNTRY_Site_T : String(20);
    @Analytics.navigationAttributeRef : [ '_0PLANT', '_1VT_DIST_', 'TXTSH' ]
    @DataIntegration.OriginalName : '0DISTR_CHAN_SiteâT'
    @Common.Label : 'Distribution channel Plant Description'
    @Common.TextFor : '0DISTR_CHAN_Site'
    _0DISTR_CHAN_Site_T : String(20);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_DIVIS', 'TXTSH' ]
    @DataIntegration.OriginalName : '0DIVISION_ArticleâT'
    @Common.Label : 'Division Material Description'
    @Common.TextFor : '0DIVISION_Article'
    _0DIVISION_Article_T : String(20);
    @Analytics.navigationAttributeRef : [ '_0PLANT', '_1VT_DIVIS', 'TXTSH' ]
    @DataIntegration.OriginalName : '0DIVISION_SiteâT'
    @Common.Label : 'Division Plant Description'
    @Common.TextFor : '0DIVISION_Site'
    _0DIVISION_Site_T : String(20);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_MATER_TEXT', 'Article_Description' ]
    @DataIntegration.OriginalName : '0MATERIALâT'
    @Common.Label : 'Article Description'
    @Common.TextFor : '_0MATERIAL'
    _0MATERIAL_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_MATL_', 'TXTLG' ]
    @DataIntegration.OriginalName : '0MATL_CAT_ArticleâT'
    @Common.Label : 'Material category Description'
    @Common.TextFor : '0MATL_CAT_Article'
    _0MATL_CAT_Article_T : String(60);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_MATL2', 'TXTSH' ]
    @DataIntegration.OriginalName : '0MATL_GROUP_ArticleâT'
    @Common.Label : 'Material group Material Description'
    @Common.TextFor : '0MATL_GROUP_Article'
    _0MATL_GROUP_Article_T : String(20);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_MATL1', 'TXTMD' ]
    @DataIntegration.OriginalName : '0MATL_TYPE_ArticleâT'
    @Common.Label : 'Material type Description'
    @Common.TextFor : '0MATL_TYPE_Article'
    _0MATL_TYPE_Article_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0PLANT', '_1VT_PLANT', 'TXTMD' ]
    @DataIntegration.OriginalName : '0PLANTâT'
    @Common.Label : 'Site Description'
    @Common.TextFor : '_0PLANT'
    _0PLANT_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_PROD_', 'TXTSH' ]
    @DataIntegration.OriginalName : '0PROD_HIER_ArticleâT'
    @Common.Label : 'Product hier Material Description'
    @Common.TextFor : '0PROD_HIER_Article'
    _0PROD_HIER_Article_T : String(20);
    @Analytics.navigationAttributeRef : [ '_0PLANT', '_1VT_0REGI', 'TXTSH' ]
    @DataIntegration.OriginalName : '0REGION_SiteâT'
    @Common.Label : 'Region Plant Description'
    @Common.TextFor : '0REGION_Site'
    _0REGION_Site_T : String(20);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VR_0RPA3', 'BEZEI' ]
    @DataIntegration.OriginalName : '0RPA_WGH1_ArticleâT'
    @Common.Label : 'Subfamily Material Description'
    @Common.TextFor : '0RPA_WGH1_Article'
    _0RPA_WGH1_Article_T : String(40);
    @Analytics.navigationAttributeRef : [ 'Department_Text_Fact', 'BEZEI' ]
    @DataIntegration.OriginalName : '0RPA_WGH2âT'
    @Common.Label : 'Material hierarchy level (1-4) Description'
    @Common.TextFor : '0RPA_WGH2'
    _0RPA_WGH2_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VR_0RPA2', 'BEZEI' ]
    @DataIntegration.OriginalName : '0RPA_WGH2_ArticleâT'
    @Common.Label : 'Department Material Description'
    @Common.TextFor : '0RPA_WGH2_Article'
    _0RPA_WGH2_Article_T : String(40);
    @Analytics.navigationAttributeRef : [ '_1VR_0RPA_', 'BEZEI' ]
    @DataIntegration.OriginalName : '0RPA_WGH3âT'
    @Common.Label : 'Material hierarchy level (1-4) Description'
    @Common.TextFor : '0RPA_WGH3'
    _0RPA_WGH3_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VR_0RPA1', 'BEZEI' ]
    @DataIntegration.OriginalName : '0RPA_WGH3_ArticleâT'
    @Common.Label : 'Product Group Material Description'
    @Common.TextFor : '0RPA_WGH3_Article'
    _0RPA_WGH3_Article_T : String(40);
    @Analytics.navigationAttributeRef : [ '_1VR_0RPA1', 'BEZEI' ]
    @DataIntegration.OriginalName : '0RPA_WGH4âT'
    @Common.Label : 'Material hierarchy level (1-4) Description'
    @Common.TextFor : '0RPA_WGH4'
    _0RPA_WGH4_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VR_0RPA_', 'BEZEI' ]
    @DataIntegration.OriginalName : '0RPA_WGH4_ArticleâT'
    @Common.Label : 'DIY Material Description'
    @Common.TextFor : '0RPA_WGH4_Article'
    _0RPA_WGH4_Article_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_PRBAN', 'TXTMD' ]
    @DataIntegration.OriginalName : '0RT_PRBAND_ArticleâT'
    @Common.Label : 'Price band cat Material Description'
    @Common.TextFor : '0RT_PRBAND_Article'
    _0RT_PRBAND_Article_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0SALESORG', '_1VT_SALES', 'TXTLG' ]
    @DataIntegration.OriginalName : '0SALESORGâT'
    @Common.Label : 'Salesorg Description'
    @Common.TextFor : '_0SALESORG'
    _0SALESORG_T : String(60);
    @Analytics.navigationAttributeRef : [ '_0PLANT', '_1VT_SALE1', 'TXTLG' ]
    @DataIntegration.OriginalName : '0SALESORG_SiteâT'
    @Common.Label : 'Salesorg Plant Description'
    @Common.TextFor : '0SALESORG_Site'
    _0SALESORG_Site_T : String(60);
    @Analytics.navigationAttributeRef : [ '_0PLANT', '_1VT_SALES', 'TXTSH' ]
    @DataIntegration.OriginalName : '0SALES_DIST_SiteâT'
    @Common.Label : 'Sales district Plant Description'
    @Common.TextFor : '0SALES_DIST_Site'
    _0SALES_DIST_Site_T : String(20);
    @Analytics.navigationAttributeRef : [ '_0CALDAY', '_MONTH', '_DESCRIPTION' ]
    @DataIntegration.OriginalName : 'CALMONTH_Calendar_DayâT'
    @Common.Label : 'Month Name'
    @Common.TextFor : 'CALMONTH_Calendar_Day'
    CALMONTH_Calendar_Day_T : String(50);
    @Analytics.navigationAttributeRef : [ '_0CALDAY', '_QUARTER', '_DESCRIPTION' ]
    @DataIntegration.OriginalName : 'CALQUARTER_Calendar_DayâT'
    @Common.Label : 'Quarter Name'
    @Common.TextFor : 'CALQUARTER_Calendar_Day'
    CALQUARTER_Calendar_Day_T : String(50);
    @Analytics.navigationAttributeRef : [ '_1VT_INFOP', 'Description' ]
    @DataIntegration.OriginalName : 'CC_INFOPROVIDERâT'
    @Common.Label : 'Infoprovider Description'
    @Common.TextFor : 'CC_INFOPROVIDER'
    CC_INFOPROVIDER_T : String(500);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_C_ACE', 'TXTMD' ]
    @DataIntegration.OriginalName : 'C_ACER006_ArticleâT'
    @Common.Label : 'Certification Description'
    @Common.TextFor : 'C_ACER006_Article'
    C_ACER006_Article_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_C_AST', 'TXTMD' ]
    @DataIntegration.OriginalName : 'C_ASTY012_ArticleâT'
    @Common.Label : 'Style/trend group Description'
    @Common.TextFor : 'C_ASTY012_Article'
    C_ASTY012_Article_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0CALDAY', '_DAY_OF_WEEK', '_DESCRIPTION' ]
    @DataIntegration.OriginalName : 'DAY_OF_WEEK_Calendar_DayâT'
    @Common.Label : 'Day Name'
    @Common.TextFor : 'DAY_OF_WEEK_Calendar_Day'
    DAY_OF_WEEK_Calendar_Day_T : String(50);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_ZARTS', 'TXTSH' ]
    @DataIntegration.OriginalName : 'ZARTSTB_ArticleâT'
    @Common.Label : 'Article status basic Description'
    @Common.TextFor : 'ZARTSTB_Article'
    ZARTSTB_Article_T : String(20);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_ZASSO', 'TXTMD' ]
    @DataIntegration.OriginalName : 'ZASSORTBC_ArticleâT'
    @Common.Label : 'Assortment City Shop Description'
    @Common.TextFor : 'ZASSORTBC_Article'
    ZASSORTBC_Article_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_ZASS1', 'TXTMD' ]
    @DataIntegration.OriginalName : 'ZASSORTBD_ArticleâT'
    @Common.Label : 'Briko Depot Assortment Description'
    @Common.TextFor : 'ZASSORTBD_Article'
    ZASSORTBD_Article_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_ZASS2', 'TXTMD' ]
    @DataIntegration.OriginalName : 'ZASSORTBE_ArticleâT'
    @Common.Label : 'E-Shop Material Assortment Description'
    @Common.TextFor : 'ZASSORTBE_Article'
    ZASSORTBE_Article_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_ZASS3', 'TXTMD' ]
    @DataIntegration.OriginalName : 'ZASSORTBL_ArticleâT'
    @Common.Label : 'Briko Luxembourg Assortment Material Description'
    @Common.TextFor : 'ZASSORTBL_Article'
    ZASSORTBL_Article_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_ZASS4', 'TXTMD' ]
    @DataIntegration.OriginalName : 'ZASSORTBR_ArticleâT'
    @Common.Label : 'Brico Assortment Material Description'
    @Common.TextFor : 'ZASSORTBR_Article'
    ZASSORTBR_Article_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_ZASS5', 'TXTMD' ]
    @DataIntegration.OriginalName : 'ZASSORTPL_ArticleâT'
    @Common.Label : 'Plan-it Assortment Material Description'
    @Common.TextFor : 'ZASSORTPL_Article'
    ZASSORTPL_Article_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_ZBKLU', 'TXTSH' ]
    @DataIntegration.OriginalName : 'ZBKLUS_ArticleâT'
    @Common.Label : 'Assortment praxis Description'
    @Common.TextFor : 'ZBKLUS_Article'
    ZBKLUS_Article_T : String(20);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_ZBRAN', 'TXTMD' ]
    @DataIntegration.OriginalName : 'ZBRAND_ID_ArticleâT'
    @Common.Label : 'Brand Description'
    @Common.TextFor : 'ZBRAND_ID_Article'
    ZBRAND_ID_Article_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_ZDIST', 'TXTSH' ]
    @DataIntegration.OriginalName : 'ZDISTP_ArticleâT'
    @Common.Label : 'Distribution profile Description'
    @Common.TextFor : 'ZDISTP_Article'
    ZDISTP_Article_T : String(20);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_ZPDEP', 'TXTSH' ]
    @DataIntegration.OriginalName : 'ZPDEPT_ArticleâT'
    @Common.Label : 'Praxis Department Description'
    @Common.TextFor : 'ZPDEPT_Article'
    ZPDEPT_Article_T : String(20);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_ZPGRO', 'TXTMD' ]
    @DataIntegration.OriginalName : 'ZPGROUP_ArticleâT'
    @Common.Label : 'Praxis group Description'
    @Common.TextFor : 'ZPGROUP_Article'
    ZPGROUP_Article_T : String(40);
    @Analytics.navigationAttributeRef : [ '_0MATERIAL', '_1VT_ZPPSL', 'TXTSH' ]
    @DataIntegration.OriginalName : 'ZPPSLARGE_ArticleâT'
    @Common.Label : 'PPS large Description'
    @Common.TextFor : 'ZPPSLARGE_Article'
    ZPPSLARGE_Article_T : String(20);
    @Analytics.navigationAttributeRef : [ '_0PLANT', '_1VT_ZSGRA', 'TXTSH' ]
    @DataIntegration.OriginalName : 'ZSGRADE_SiteâT'
    @Common.Label : 'Store Grade Description'
    @Common.TextFor : 'ZSGRADE_Site'
    ZSGRADE_Site_T : String(20);
    @Analytics.navigationAttributeRef : [ '_0PLANT', '_1VT_ZSTPR', 'TXTMD' ]
    @DataIntegration.OriginalName : 'ZSTPROF_SiteâT'
    @Common.Label : 'Store type Description'
    @Common.TextFor : 'ZSTPROF_Site'
    ZSTPROF_Site_T : String(40);
    Parameters : Association to one _4AM_POS_01 {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @Capabilities.CountRestrictions.Countable : false
  @Capabilities.DeleteRestrictions.Deletable : false
  @Capabilities.InsertRestrictions.Insertable : false
  @Capabilities.UpdateRestrictions.Updatable : false
  entity _4AM_POS_01 {
    @Common.FieldControl : #Mandatory
    key IP_START_DATE : Date not null;
    @Common.FieldControl : #Mandatory
    key IP_END_DATE : Date not null;
    Set : Association to many _4AM_POS_01Type {  };
  };
};

