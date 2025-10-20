// using { AMPOS as externalPOS } from './external/AMPOS';

@path: '/base'
service DSService {

    @cds.persistence.skip
    entity PosAnalyticsDSP  {
        key ID: UUID;
        IP_START_DATE: Date @mandatory;
        IP_END_DATE: Date @mandatory;
        _0SALESORG_1: String(4);
        _0PLANT_1: String(4);
        CK_SALES_QUANTITY: Double;
        _0RPA_SAT: Decimal
    }; 

    entity test{
        key ID: UUID;
        IP_START_DATE: Date @mandatory;
        IP_END_DATE: Date @mandatory;
        _0SALESORG_1: String(4);
        _0PLANT_1: String(4);
        CK_SALES_QUANTITY: Double;
        _0RPA_SAT: Decimal
    }
};