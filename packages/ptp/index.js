// Init events.
require('./main/events.js');
// Init commands.
require('./main/commands.js');


let Game = require("./main/state.js").GameState;

var CurrentGame = mp.Game = new Game();

CurrentGame.start();