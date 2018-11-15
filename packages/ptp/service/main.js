/* 
    Author: Plornt
    Date: 11/12/2018
    Version: 1.0
    Description: This service is designed to provide a Restful API service to interact with the PTP minigame
*/
var swaggerJSDoc = require('swagger-jsdoc');
var express = require('express');
var swaggerUi = require('swagger-ui-express');


// swagger definition


//Load api routes
var glob = require( 'glob' ), path = require( 'path' );

class PTPService {
    constructor(sDefinition) {
        var app = express();
        this.app = app;
        this.port = sDefinition.port;
        delete sDefinition.port;

        var routes = __dirname + '/api/*/*.js';
        glob.sync(routes).forEach( function( file ) {
            var route = require(path.resolve(file));
            if(typeof route == "function")
                route(app);
        });
        // initialize swagger-jsdoc
        var swaggerSpec = swaggerJSDoc({
            // import swaggerDefinitions
            swaggerDefinition: sDefinition,
            // path to the API docs
            apis: [routes],// pass all in array 
        });
        app.get('/swagger.json', function(req, res) {   res.setHeader('Content-Type', 'application/json');   res.send(swaggerSpec); });
        //Setup 
        app.use('/api', swaggerUi.serve, swaggerUi.setup(null, {
            swaggerUrl: `/swagger.json`
        }));
    }
    start(game) {
        this.game = game;
        this._server = this.app.listen(this.port,'0.0.0.0');
        this.app.set("service",this);
        Console.log(`PTP Service is currently running on port [${this.port}]...`);
    }
    stop() {
        if(!this._server)
            return;
        this._server.close();
    }
}
module.exports = PTPService;
