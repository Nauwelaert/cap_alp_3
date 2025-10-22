sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"posalp/test/integration/pages/PosAnalyticsDSPList",
	"posalp/test/integration/pages/PosAnalyticsDSPObjectPage"
], function (JourneyRunner, PosAnalyticsDSPList, PosAnalyticsDSPObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('posalp') + '/index.html',
        pages: {
			onThePosAnalyticsDSPList: PosAnalyticsDSPList,
			onThePosAnalyticsDSPObjectPage: PosAnalyticsDSPObjectPage
        },
        async: true
    });

    return runner;
});

