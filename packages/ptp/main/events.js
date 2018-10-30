//let Preferences = require('./main/preferences.js');
let SpawnPoints = require('./models/SpawnPoints.js').SpawnPoints;

mp.events.add('playerExitVehicle', (player) => {
    player.call('playerExitVehicle');
    //player.outputChatbox("Left vehicle");
    console.log("Dude exited a vehicle");
});
mp.events.add('playerDeath',(player) =>
{
    var spawns = player.team.spawns;
    var spawn = spawns[spawns.length * Math.random()];
    if(!spawn)
        spawn = new mp.Vector3(0,0,0);
    player.spawn(spawn);
    player.health = 100;
    mp.vehicles.new(mp.joaat(vehName), pos);
});
mp.events.add('playerJoin',(player) => {
    mp.Game.add(player);
});
mp.events.add('playerQuit',(player) => {
    mp.Game.remove(player);
});