//Load PTP service configuration (check if we need to even run tests)
var serviceConfig = {};
try {
    serviceConfig = require(`../packages/ptp/configs/service_config-dev.json`);
} catch(e) {
    console.log("No service_config-dev.json. Cannot run database tests.");
    return;
}
var assert = require("assert");
var request = require("request");
global.mp = mp = require("./mock/Multiplayer.js");
var GameState = require(`../packages/ptp/main/state.js`);
var ServiceDAO = require(`../packages/ptp/service/main.js`);
var preferences = require("../packages/ptp/configs/default.js");
//GameState depends on Console object and MP extentions
if(!global.Console) global.Console = require(`../packages/ptp/main/models/Logger.js`).Console;
Console.log = ()=> {}
require("../packages/ptp/main/models/Multiplayer.js");

//Set up test requirements
var service = new ServiceDAO(serviceConfig);
var Game = new GameState(preferences);
service.start(Game);

describe('PTP Service Tests',() => {

    describe('/server/time',() => {
        it('should return integer', function(done) {

            request('http://localhost:3000/server/time',(error,response,body) => {
                if(isNaN(parseInt(body)))
                    assert.fail(new Error());
                done();
            });
        });
    });
    describe('/ptp/current',() => {
        it('should return expected MinigameState', function(done) {
            var p1 = new mp.Player("Plornt");
            var p2 = new mp.Player("Schamens");
            Game.add(p1);
            Game.add(p2);
            Game.moveTeam(p1,Game.teams[0]);
            Game.moveTeam(p1,Game.teams[2]);
            request('http://localhost:3000/ptp/current',(error,response,body) => {
                if(error)
                    assert.fail("Could not complete request to service");
                else
                {
                    var data = JSON.parse(body);
                    if(data.state == Game.state && data.players.length == Game.players.length && data.teams[0].players.length == Game.teams[0].length && data.teams[2].players.length == Game.teams[2].length)
                        assert.equal(1,1);
                    else
                        assert.fail(new Error("Result does not match expected game state"));
                }
                done();
            });
        });
    });
});
after(done => {
    service.stop();
    done();
});