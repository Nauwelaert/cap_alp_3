using { DSService } from './ds-service';

// 1. Aggregation and analytical annotations
annotate DSService.PosAnalyticsDSP with @(
  Aggregation.ApplySupported: {
    Transformations: [
      'aggregate',
      'topcount',
      'bottomcount',
      'identity',
      'concat',
      'groupby',
      'filter',
      'expand',
      'search'      
    ],
    Rollup: #None,
    PropertyRestrictions: true,
    GroupableProperties: [
      _0SALESORG_1,
      _0PLANT_1
    ],
    AggregatableProperties: [
      {
        Property: CK_SALES_QUANTITY,
        SupportedAggregationMethods: ['sum']
      },
      {
        Property: _0RPA_SAT,
        SupportedAggregationMethods: ['sum']
      }
    ]
  },
  Analytics.AggregatedProperties: [
    {
      Name: 'TotalSalesQuantity',
      AggregationMethod: 'sum',
      AggregatableProperty: CK_SALES_QUANTITY,
      ![@Common.Label]: 'Total Sales Quantity'
    },
    {
      Name: 'TotalSalesAmount',
      AggregationMethod: 'sum',
      AggregatableProperty: _0RPA_SAT,
      ![@Common.Label]: 'Total Sales Amount'
    }
  ]
){
  _0SALESORG_1 @Analytics.Dimension;
  _0PLANT_1 @Analytics.Dimension;
  CK_SALES_QUANTITY @Analytics.Measure @Aggregation.default: #SUM;
  _0RPA_SAT @Analytics.Measure @Aggregation.default: #SUM;
};

// 2. Presentation and UI settings
annotate DSService.PosAnalyticsDSP with @(
  UI: {
    PresentationVariant: {
      SortOrder: [
        {Property: _0SALESORG_1, Descending: false}
      ],
      Total: [
        TotalSalesQuantity,
        TotalSalesAmount
      ],
      Visualizations: [
        '@UI.LineItem',
        '@UI.Chart#alpChart'
      ]
    },
    SelectionFields: [
      IP_START_DATE,
      IP_END_DATE,
      _0SALESORG_1,
      _0PLANT_1
    ],
    LineItem: [
      { $Type : 'UI.DataField', Value : _0SALESORG_1, Label: 'Sales Organization' },
      { $Type : 'UI.DataField', Value : _0PLANT_1, Label: 'Plant' },
      { $Type : 'UI.DataField', Value : CK_SALES_QUANTITY, Label: 'Sales Quantity' },
      { $Type : 'UI.DataField', Value : _0RPA_SAT, Label: 'Sales Amount' }
    ],
    Chart #alpChart : {
      $Type : 'UI.ChartDefinitionType',
      ChartType : #Bar,
      Dimensions : [
        _0SALESORG_1,
        _0PLANT_1
      ],
      Measures : [
        CK_SALES_QUANTITY,
        _0RPA_SAT
      ],
      Title: 'Sales by Organization and Plant'
    }
  }
);