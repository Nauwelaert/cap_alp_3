
@path: '/pos'


service PosService {

    @cds.persistence.skip
    entity  PosAnalyticsDSP{
        key ID: UUID;
        _0SALESORG_1: String(4);
        _0PLANT_1: String(4);
        CK_SALES_QUANTITY: Double;
        _0RPA_SAT: Decimal
    };  
}