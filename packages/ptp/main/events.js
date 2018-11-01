//let Preferences = require('./main/preferences.js');
let SpawnPoints = require('./models/SpawnPoints.js').SpawnPoints;

mp.events.add('playerExitVehicle', (player) => {
    player.call('playerExitVehicle');
    //player.outputChatbox("Left vehicle");
    console.log("Dude exited a vehicle");
});
mp.events.add("playerChat",(player, text) => {
    mp.players.broadcast(`[${player.name}: ${text}]`);
});
mp.events.add('playerDeath',(player) =>
{
    if(!player.team)
    {
        player.call('playerDeath');
        return;
    }
    var spawns = player.team.spawns;
    var spawn = spawns[spawns.length * Math.random()];
    if(!spawn)
        spawn = new mp.Vector3(0,0,0);
    player.spawn(spawn);
    player.health = 100;
});
mp.events.add('playerJoin',(player) => {
    console.log(`${player.name} has joined the server.`);
    mp.players.broadcast(`${player.name} has joined the server.`);
    mp.Game.add(player);
});
mp.events.add('playerQuit',(player) => {
    mp.Game.remove(player);
});