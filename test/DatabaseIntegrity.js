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

//dbConfig.host = "localhost";
describe('Database Integrity Tests',() => {
    
    var database = new DatabaseDAO(dbConfig);
    var p = database.connect();
    it('Can connect to remote database',() =>
    {
        return p;
    });
    /*
    it('Can create database and tables',function () {
        var database = new DatabaseDAO(dbConfig);
        return database.connect();
    });
    */
   it('Test account exists',function () {

    return p=database.accountExists("test");
    });
    it('Can log into test user account',function () {

        return p=database.login({
            username: "test",
            password: "test"
        });
    });
    setTimeout(() => {
        database.close();
    },5000);
});
