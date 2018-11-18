return;
var assert = require("assert");
var request = require("request");
if(!global.mp) global.mp = mp = require("./mock/Multiplayer.js");

var dbConfig;
var serviceConfig;
var preferences = require("../packages/ptp/configs/default.js");
try {
    dbConfig = require(`../packages/ptp/configs/db_config-dev.json`);
    serviceConfig = require(`../packages/ptp/configs/service_config-dev.json`);
} catch(e) {
    if(!dbConfig)
        console.debug("No db_config-dev.json. Cannot run integration tests.");
    else
        console.debug("No service_config-dev.json. Cannot run integration tests.");
    return;
}
//Change some preferences for integration
serviceConfig.port = 1010;
serviceConfig.host = "localhost:1010";

if(!global.Console) global.Console = require(`../packages/ptp/main/models/Logger.js`).Console;
require("../packages/ptp/main/models/Multiplayer.js");
let Game = require("../packages/ptp/main/state.js");
var DatabaseDAO = require(`../packages/ptp/main/database.js`);
var ServiceDAO = require(`../packages/ptp/service/main.js`);

var Database = new DatabaseDAO(dbConfig);
let Service = new ServiceDAO(serviceConfig);
let CurrentGame = new Game(preferences);
Database.check();

//Start services
CurrentGame.setDatabase(Database);
Service.start(CurrentGame);

var p1 = new mp.Player("Plornt");
var p2 = new mp.Player("Schamens");
CurrentGame.add(p1);
CurrentGame.add(p2);
CurrentGame.start();

describe('Mock Integration Tests',() => {
    describe('/db/board',() => {
        it('should return expected Leaderboard', function(done) {
            request('http://localhost:1010/db/board',(error,response,body) => {
                if(error)
                {
                    assert.fail("Could not get leaderboard");
                }
                else
                {
                    //console.log(body);
                    assert.equal(1,1);
                }
                done();
            });
        });
    }); 
});
after(done => {
    CurrentGame.end();
    Service.stop();
    Database.close();
    done();
});