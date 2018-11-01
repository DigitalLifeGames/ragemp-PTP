//let Preferences = require('./main/preferences.js');
let SpawnPoints = require('./models/SpawnPoints.js').SpawnPoints;

mp.events.add('playerExitVehicle', (player) => {
    player.call('playerExitVehicle');
    //player.outputChatbox("Left vehicle");
    console.log("Dude exited a vehicle");
});
mp.events.add("playerChat",(player, text) => {
    MessageAll(`[${player.name}]: ${text}`);
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
    player.model = skins[skin];
});
mp.events.add('playerJoin',(player) => {
    console.log(`${player.name} has joined the server.`);
    mp.players.broadcast(`${player.name} has joined the server.`);
    mp.Game.add(player);
});
mp.events.add('playerQuit',(player) => {
    mp.Game.remove(player);
});