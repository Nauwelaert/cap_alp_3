using { DSService } from './ds-service';

// 1. Aggregation and analytical annotations
annotate DSService.PosAnalyticsDSP with @(
  Aggregation.ApplySupported: {
    Transformations: [
      'aggregate','topcount','bottomcount','identity','concat','groupby','filter','expand','search'
    ],
    GroupableProperties: [
      _0SALESORG_1, _0PLANT_1
    ],
    AggregatableProperties: [
      { $Type: 'Aggregation.AggregatablePropertyType', Property: CK_SALES_QUANTITY },
      { $Type: 'Aggregation.AggregatablePropertyType', Property: _0RPA_SAT }
    ]
  },
  Aggregation.CustomAggregate #CK_SALES_QUANTITY: 'Edm.Double',
  Aggregation.CustomAggregate #_0RPA_SAT: 'Edm.Decimal'
){
  CK_SALES_QUANTITY @Analytics.Measure @Aggregation.default: #SUM;
  _0RPA_SAT         @Analytics.Measure @Aggregation.default: #SUM;
};

// 2. REQUIRED filters (standalone annotation)
annotate DSService.PosAnalyticsDSP with @Capabilities.FilterRestrictions: {
  RequiredProperties: [ IP_START_DATE, IP_END_DATE ]
};

// 3. Mandatory field control (ensures asterisk)
annotate DSService.PosAnalyticsDSP with {
  IP_START_DATE @Common.FieldControl: #Mandatory;
  IP_END_DATE   @Common.FieldControl: #Mandatory;
};

// 4. Presentation and UI
annotate DSService.PosAnalyticsDSP with @(
  UI: {
    PresentationVariant: {
      Total: [ CK_SALES_QUANTITY, _0RPA_SAT ],
      Visualizations: [ '@UI.LineItem', '@UI.Chart#alpChart' ]
    },
    SelectionFields: [ IP_START_DATE, IP_END_DATE, _0SALESORG_1, _0PLANT_1 ],
    LineItem: [
      { $Type: 'UI.DataField', Value: _0SALESORG_1, Label: 'Sales Organization' },
      { $Type: 'UI.DataField', Value: _0PLANT_1, Label: 'Plant' },
      { $Type: 'UI.DataField', Value: CK_SALES_QUANTITY, Label: 'Sales Quantity' },
      { $Type: 'UI.DataField', Value: _0RPA_SAT, Label: 'Sales Amount' }
    ],
    Chart #alpChart: {
      $Type: 'UI.ChartDefinitionType',
      ChartType: #Bar,
      Dimensions: [ _0SALESORG_1, _0PLANT_1 ],
      Measures: [ CK_SALES_QUANTITY, _0RPA_SAT ],
      Title: 'Sales by Organization and Plant'
    }
  }
);



