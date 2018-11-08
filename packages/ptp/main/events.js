//let Preferences = require('./main/preferences.js');
let SpawnPoints = require('./models/SpawnPoints.js').SpawnPoints;

mp.events.add('playerExitVehicle', (player) => {
    player.call('playerExitVehicle');
    //player.outputChatbox("Left vehicle");
    console.log("Dude exited a vehicle");
});
mp.events.add("playerChat",(player, text) => {
    if(text.substring(0,1) == "$")
    {
        var line = text.substring(1);

        global.me = player;
        var res = eval(line);
        MessageAll("--> " + res);
        global.me = undefined;
        return;
    }
    var name = player.name;
    if(player.logged)
        name = "[1] " + name;
    //Check if ptp is running
    if(mp.Game.state > 1 && mp.Game.getTeam(player))
    {
        var prefix = `!{#${mp.Game.getTeam(player).teamColor}}`;
        MessageAll(`${prefix}${name}!{#FFFFFF}: ${text}`);
        return;
    }
    MessageAll(`!{#FFFF00}${name}!{#FFFFFF}: ${text}`);
});
mp.events.add('playerDeath',(player,reason, killer) =>
{   
    if(!player.team)
    {
        player.call('playerDeath');
        return;
    }
    if (player.respawnTimer) clearTimeout(player.respawnTimer);
    player.respawnTimer = setTimeout(() => {
        mp.Game.spawnPlayer(player);
        clearTimeout(player.respawnTimer);
        player.respawnTimer = undefined;
    }, 8000);
    mp.Game.playerDeath(player,killer);
});

mp.events.add('playerSpawn',(player) =>
{
    if(!player.team)
    {
        player.call('playerDeath');
        return;
    }
});
mp.events.add('playerJoin',(player) => {
    console.log(`${player.name} has joined the server.`);
    mp.players.broadcast(`${player.name} has joined the server.`);

    if(mp.Game.state > 0)
        mp.Game.add(player);
    
    Database.accountExists(player.name).then(() => {
        player.outputChatBox("Type /login to login");
    }).catch(() => {
        player.outputChatBox("Type /signup [password] to create an account!");
    });
});
mp.events.add('playerQuit',(player) => {
    Console.log(`${player.name} has disconnected.`);
    mp.Game.remove(player);
});