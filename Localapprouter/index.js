const approuter = require('@sap/approuter');
const config = require('./xs-app.json');

const fs = require("fs");

config.routes.forEach((oRoute) => {
    if (oRoute.localDir && oRoute.localDir === "webapp") {
        oRoute.localDir = "../webapp"
    }
})
approuter().start({ 
    xsappConfig: config,
    httpsOptions: {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    }
 });
