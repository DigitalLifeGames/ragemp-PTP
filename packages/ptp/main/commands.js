mp.events.addCommand('veh', (player, _, vehName) => {
    mp.vehicles.new(mp.joaat(vehName), player.position);
});
mp.events.addCommand('kill',(player) => {
    player.health = 0;
    player.spawn();
});
mp.events.addCommand('reset',() =>
{
    mp.Game.reset();
});