//Process arguments (Debug, Mock mode)
var debug = false;
global.ENVIRONMENT = process.env.ENVIRONMENT;
var mock = false;
process.argv.forEach(function (val, index, array) {
    if(val == "mock")
    {
        console.log("Mocking enabled...");
        mock = true;
    }
});
//Enable mocking? 
if(mock)
{
    mp = require("../../test/mock/Multiplayer.js");
}
//Init extensions
require("./main/models/Multiplayer.js");
//require("./main/models/CommandLine.js");

//Create logger
Console = require("./main/models/Logger.js").Console;
Console.open("logs/" + Date.now() + ".log",{log_colors: false});

var DatabaseDAO = require("./main/database.js");
var ServiceDAO = require("./service/main.js");

//Load database configuration
var dbConfig = {username: "username",password: "password",host: "localhost",database: "ptp_db"};
try {   
    dbConfig = require(`./configs/db_config${ENVIRONMENT=="DEV" ? "-dev":""}.json`);
} catch(e) {
    Console.debug("Could not find database configuration, using default...");
}
//Load PTP service configuration
var serviceConfig = {};
try {
    serviceConfig = require(`./configs/service_config${ENVIRONMENT=="DEV" ? "-dev":""}.json`);
} catch(e) {
    Console.debug("Could not find service configuration, using default...");
}

global.Database = new DatabaseDAO(dbConfig,err => {
    if (err)
    {
        Console.error("Unable to connect to database");
        Console.error(`-- ${dbConfig.username}:******@${dbConfig.host}`);
        return;
    }
    Console.log("Connected to the database");
});
Database.check();

// Init commands/events.
require('./main/events.js');
require('./main/commands.js');
// Init Preferences
var preferences = require("./configs/default.js");


let Game = require("./main/state.js");
global.CurrentGame = mp.Game = new Game(preferences);
//Create PTPService
global.Service = new ServiceDAO(serviceConfig);

//Start services
CurrentGame.start();
Service.start(CurrentGame);

//Are we mocking
if(!mock) return;

/*
Console.log("");
//Simulate players
Mock.AddPlayer(new mp.Player("Plornt"));
Mock.AddPlayer(new mp.Player("Schamens"));
Mock.AddPlayer(new mp.Player("Tricky"));

//Mock.ServerCommand(fcbn("Plornt"),"reset");
//Mock.ServerCommand(fcbn("Tricky"),"move","Terrorist");


//Mock.ServerCommand(fcbn("Plornt"),"signup","testpassword");
//Mock.ServerCommand(fcbn("Plornt"),"round","");
Mock.ServerCommand(fcbn("Plornt"),"login","wat");

setTimeout(function() {
    CurrentGame.endRound(mp.Game.getTeam(fcbn("Plornt")));
    CurrentGame.end();
    Database.close();
},30000);
*/