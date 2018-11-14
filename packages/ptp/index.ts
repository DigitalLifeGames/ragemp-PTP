import Logger from './main/models/Logger';

//Process arguments (Debug, Mock mode)
var debug = false;

//Init extensions
require("./main/models/Multiplayer.js");
//require("./main/models/CommandLine.js");

//Create logger
global.loggerInstance = new Logger();
global.loggerInstance.open("logs/" + Date.now() + ".log",{log_colors: false});

var DatabaseDAO = require("./main/database.js");
var ServiceDAO = require("./service/main.js");

//Create database
var dbConfig = {username: "username",password: "password",host: "localhost",database: "ptp_db"};
try {   
    dbConfig = require("./db_config.json");
} catch(e) {
    global.loggerInstance.log("Could not find database configuration, using default...");
}
global.Database = new DatabaseDAO(dbConfig,err => {
    if (err)
    {
        global.loggerInstance.error("Unable to connect to database");
        global.loggerInstance.error(`-- ${dbConfig.username}:******@${dbConfig.host}`);
        return;
    }
    global.loggerInstance.log("Connected to the database");
});
Database.check();

// Init commands/events.
require('./main/events.js');
require('./main/commands.js');
// Init Preferences
var preferences = require("./configs/default.js");


let Game = require("./main/state.js").GameState;
global.CurrentGame = mp.Game = new Game(preferences);
CurrentGame.start();

//Create PTPService
global.Service = new ServiceDAO();
Service.start();

CurrentGame.end();
global.loggerInstance.log("Game ended");

setTimeout(function() {
    CurrentGame.endRound(mp.Game.getTeam(fcbn("Plornt")));
    CurrentGame.end();
    Database.close();
},5000);