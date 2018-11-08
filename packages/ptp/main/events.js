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
        MessageAll("--> " + eval(line));
        return;
    }
    //Check if ptp is running
    if(mp.Game.state > 1 && mp.Game.getTeam(player))
    {
        var prefix = `!{#${mp.Game.getTeam(player).teamColor}}`;
        MessageAll(`${prefix}${player.name}!{#FFFFFF}: ${text}`);
        return;
    }
    MessageAll(`!{#FFFF00}${player.name}!{#FFFFFF}: ${text}`);
});
mp.events.add('playerDeath',(player) =>
{
    if(!player.team)
    {
        player.call('playerDeath');
        return;
    }
    var spawns = player.team.spawns;
    var spawn = spawns[Math.floor(spawns.length * Math.random())];
    if(!spawn)
        spawn = new mp.Vector3(0,0,0);
    player.spawn(spawn);
    player.health = 100;

    //Skin
    var skins = mp.joaat(player.team.skins);
    var skin = skins[Math.floor(skins.length * Math.random())];
    console.log(skins[skin],skins);
    player.model = skins[skin];
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