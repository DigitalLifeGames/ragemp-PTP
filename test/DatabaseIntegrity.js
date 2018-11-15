var assert = require("assert");
global.mp = mp = require("./mock/Multiplayer.js");
var dbConfig;
try {
    dbConfig = require(`../packages/ptp/configs/db_config-dev.json`);
} catch(e) {
    console.log("No db_config-dev.json. Cannot run database tests.");
    return;
}
var DatabaseDAO = require(`../packages/ptp/main/database.js`);
var database = new DatabaseDAO(dbConfig);

describe('Database Integrity Tests',() => {
    
    var p = database.connect();
    p.then(() => {
        describe('Database Integrity Tests',() => {
            DoTests();
        });
        after(done => {
            database.close();
            done();
        });        
    },(err) => {
        assert.fail(err);
    });
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
   var DoTests = () => {
   it('Test account exists/create',function () {
        return database.select("accounts",{username: "test"}).catch(() =>
        {
            return database.createAccount({
                username: "test",
                password: "testpasword"
            });
        });
    });
    it('Can log into test user account',function () {
        return database.login(new mp.Player("test"),"testpassword");
    });
    it('Can add score to test account',function () {
        return database.addScore("test",{
            kills: 1,
            wins: 1,
            president: 1,
        });
    });
    it('Can set password for test account',function () {
        return database.setPassword("test","testpassword");
    });
    it('Can add vehicle spawn to database',function () {
        return database.insert("vehicles",{
            position: "10 20 30",
            rotation: 10,
            datablock: "FIB2"
        });
    });
    it('Vehicle manifest from database',function () {
        return database.select("vehicles",{
        });
    });
   }
});