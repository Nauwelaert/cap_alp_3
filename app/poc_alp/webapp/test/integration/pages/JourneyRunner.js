sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"pocalp/test/integration/pages/PosAnalyticsDSPList",
	"pocalp/test/integration/pages/PosAnalyticsDSPObjectPage"
], function (JourneyRunner, PosAnalyticsDSPList, PosAnalyticsDSPObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('pocalp') + '/index.html',
        pages: {
			onThePosAnalyticsDSPList: PosAnalyticsDSPList,
			onThePosAnalyticsDSPObjectPage: PosAnalyticsDSPObjectPage
        },
        async: true
    });

    return runner;
});

