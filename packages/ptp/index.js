//Init extensions
require("./main/models/Multiplayer.js");
Console = require("./main/models/Logger.js").Console;

// Init events.
require('./main/events.js');
// Init commands.
require('./main/commands.js');
// Init Preferences
var preferences = require("./configs/default.js");


let Game = require("./main/state.js").GameState;

global.CurrentGame = mp.Game = new Game(preferences);

CurrentGame.start();