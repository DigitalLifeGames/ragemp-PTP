//Init extensions
require("./main/models/Multiplayer.js");
//require("./main/models/CommandLine.js");
Console = require("./main/models/Logger.js").Console;
Console.open("logs/" + Date.now() + ".log");

// Init events.
require('./main/events.js');
// Init commands.
require('./main/commands.js');
// Init Preferences
var preferences = require("./configs/default.js");


let Game = require("./main/state.js").GameState;

global.CurrentGame = mp.Game = new Game(preferences);

CurrentGame.start();