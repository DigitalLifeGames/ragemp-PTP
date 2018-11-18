var PTP = (player) => CurrentGame.players.indexOf(player) == -1 ? false:true;

mp.events.addCommand('weapons',(player) => {
    if(PTP(player)) return;

    //Give player all weapons
});