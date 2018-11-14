/* 
    Author: Plornt
    Date: 11/12/2018
    Version: 1.0
    Description: This service is designed to provide a Restful API service to interact with the PTP minigame
*/
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
var SwaggerExpress = require('swagger-express-mw');
var express = require('express');
var config = {
  appRoot: __dirname // required config
};
var swaggerUi = require('swagger-ui-express');

class PTPService {
    constructor() {
        var app = express();
        this.app = app;
        this.port = 3000;

        SwaggerExpress.create(config, (err, swaggerExpress) => {
        if (err) { throw err; }
            // install middleware
            swaggerExpress.register(app);
        });
        //Setup 
        app.use('/api', swaggerUi.serve, swaggerUi.setup(null, {
            swaggerUrl: `/swagger`
        }));
    }
    start() {
        this.app.listen(this.port,'0.0.0.0');
        Console.log(`PTP Service is currently running on port [${this.port}]...`);
    }
    stop() {
        
    }
}
module.exports = PTPService;
