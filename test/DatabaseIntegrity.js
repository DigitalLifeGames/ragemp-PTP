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
    
    var tests = [];
    var p = database.connect();
    it('Can connect to remote database',() =>
    {
        tests.push(p);
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
        var t = p.then(() => database.select("accounts",{username: "test"}).catch(() =>
        {
            var t = database.createAccount({
                username: "test",
                password: "testpasword"
            });
            tests.push(t);
            return t;
        }));
        tests.push(p);
        return t;
    });
    it('Can log into test user account',function () {

        var t = p.then(() => database.login(new mp.Player("test"),"testpassword"));
        tests.push(t);
        return t;
    });
    it('Can add score to test account',function () {

        var t = p.then(() => database.addScore("test",{
            kills: 1,
            wins: 1,
            president: 1,
        }));
        tests.push(t);
        return t;
    });
    it('Can set password for test account',function () {

        var player = new mp.Player("test");
        var t = p.then(() => {
            var t = database.setPassword(player.name,"testpassword");
            tests.push(t);
            return t;
        });
        tests.push(t);
        return t;
    });
    it('Can add vehicle spawn to database',function () {

        return p=database.insert("vehicles",{
            position: "10 20 30",
            rotation: 10,
            datablock: "FIB2"
        });
    });
    it('Vehicle manifest from database',function () {
        var t = p.then(() => database.select("vehicles",{
        }));
        return t;
    });
    Promise.all(tests).then( ()=> {
        setTimeout(function () {
            database.close();
        },500);
    });
});