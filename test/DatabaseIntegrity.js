var assert = require("assert");
global.mp = mp = require("./mock/Multiplayer.js");
require("../packages/ptp/index.js");
var DatabaseDAO = require("../packages/ptp/main/database.js");
var dbConfig;
try
{   
    dbConfig = require("../packages/ptp/db_config.json");
}catch(e){}

//Only run tests if we have a Database configuration
if(!dbConfig)
    return;
describe('Database Integrity Tests',() => {
    
    it('Can connect to remote database',function () {
        return new Promise((resolve) => {
            var database = new DatabaseDAO(dbConfig,function(err)
            {
                if(err)
                    assert.fail(err.message);
                assert.fail("wat");
                resolve();
            });
        });
    });
});
