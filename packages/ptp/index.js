//Init extensions
require("./main/models/Multiplayer.js");

// Init events.
require('./main/events.js');
// Init commands.
require('./main/commands.js');
// Init Preferences
var preferences = require("./configs/default.js");


let Game = require("./main/state.js").GameState;

var CurrentGame = mp.Game = new Game(preferences);

CurrentGame.start();