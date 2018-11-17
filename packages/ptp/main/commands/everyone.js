mp.events.addCommand('pos', (player) => {
    var x = player.position.x;
    var y = player.position.y;
    var z = player.position.z;
    player.outputChatBox(`Position: ${x},${y},${z}`);
});

mp.events.addCommand('kill',(player) => {
    player.health = 0;
    player.spawn();
});