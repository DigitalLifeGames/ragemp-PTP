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
global.Database = require("./main/database.js");

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

//Simulate players
Mock.AddPlayer(new mp.Player("Plornt"));
Mock.AddPlayer(new mp.Player("Schamens"));