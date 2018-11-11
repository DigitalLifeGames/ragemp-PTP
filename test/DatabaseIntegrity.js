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

var database = new DatabaseDAO(dbConfig);
//dbConfig.host = "localhost";
describe('Database Integrity Tests',() => {
    

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
   it('Test account exists/create',function ()
   {
    return p=database.select("accounts",{username: "test"}).catch(() => {
        return database.createAccount({
            username: "test",
            password: "test"
        });
    })});
    it('Can log into test user account',function () {

        return p=database.login({
            username: "test",
            password: "test"
        });
    });
    it('Can add score to test account',function () {

        return p=database.addScore("test",{
            kills: 1,
            wins: 1,
            president: 1,
        });
    });
    /*
    it('Can add vehicle spawn to database',function () {

        return p=database.insert("vehicles",{
            position: "10 20 30",
            rotation: 10,
            datablock: "FIB2"
        });
    });
    */
    it('Vehicle manifest from database',function () {

        return p=database.select("vehicles",{
        });
    });
    console.log(database.user);
});
setTimeout(() => {
    database.close();
},5000);