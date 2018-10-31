mp.events.addCommand('veh', (player, _, vehName) => {
    mp.vehicles.new(mp.joaat(vehName), player.position);
});
mp.events.addCommand('pos', (player) => {
    var x = player.position.x;
    var y = player.position.y;
    var z = player.position.z;
    player.outputChatBox(`Position: ${x},${y},${z}`);
});
mp.events.addCommand('cleanup', (player) => {
    mp.players.broadcast(`There are ${mp.Game.gameObjects.length} objects spawned.`);
    mp.Game.cleanUp();
});
mp.events,addCommand('tp',(player,location) => {
    var target = mp.fcbn(location);
    if(target)
    {
        player.position = target.position;
    }
    else
    {
        switch(location.toLowerCase())
        {
            case "police":
                player.position = new mp.Vector3(0,0,0);
                break;
            case "president":
                player.position = new mp.Vector3(0,0,0);
        }
    }
});

mp.events.addCommand('kill',(player) => {
    player.health = 0;
    player.spawn();
});
mp.events.addCommand('reset',() =>
{
    mp.Game.reset();
});