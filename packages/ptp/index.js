//Process arguments (Debug, Mock mode)
var debug = false;
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

//Create database
var DatabaseDAO = require("./main/database.js");

var dbConfig = require("./db_config.json");

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

// Init events.
require('./main/events.js');
// Init commands.
require('./main/commands.js');
// Init Preferences
var preferences = require("./configs/default.js");


let Game = require("./main/state.js").GameState;

global.CurrentGame = mp.Game = new Game(preferences);

CurrentGame.start();


//Are we mocking
if(!mock) return;

/*
//Simulate players
Mock.AddPlayer(new mp.Player("Plornt"));
Mock.AddPlayer(new mp.Player("Schamens"));
Mock.AddPlayer(new mp.Player("Tricky"));

Mock.ServerCommand(fcbn("Plornt"),"reset");
Mock.ServerCommand(fcbn("Tricky"),"move","Terrorist");
*/