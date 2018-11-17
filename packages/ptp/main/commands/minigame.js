//Get list of available teams
mp.events.addCommand('teams',(player) => {
    mp.Game.teams.forEach(t => {
        player.outputChatBox(`|| !{#${t.teamColor}}${t.name}!{#FFFFFF}: ${t.length} players`);
    });
});
//Get current round information
mp.events.addCommand('round',(player) => {
    var game = mp.Game;
    var state = game.state;
    if(state == 0)
    {
        player.outputChatBox("Protect the president can be started at any time!");
    }
    else if(state == 1)
        player.outputChatBox("PTP is waiting for more players to join...");
    else if(state == 2)
    {
        var count = game.players.length;
        var round = game.round;
        var timems = Math.ceil((game.roundLength-(Date.now()-game.startTime))/60/1000);

        player.outputChatBox(`Round: !{#44FFFF}${round}`);
        player.outputChatBox(`Time left: !{#44FFFF}${timems} minutes`);
        player.outputChatBox(`Players: !{#44FFFF}${count}`);
    }
});

////////////////////||
//Admin commands    ||
////////////////////||

//Reset current round
mp.events.addCommand('reset',(player) =>
{
    if(!player.admin) return player.outputChatBox(`!{#FF0000}You must be admin to use this command.`);
    mp.Game.reset();
});

//Reload minigame configuration
mp.events.addCommand('reload',(player,config) => {
    if(!player.admin) return player.outputChatBox(`!{#FF0000}You must be admin to use this command.`);
    //New game
    if(!config)
        config = "default";
    var path = `../configs/${config}.js`;
    delete require.cache[require.resolve(path)];
    var preferences = require(path);
    var game = mp.Game;
    game.end();
    mp.Game = new mp.Game.constructor(preferences);
    mp.Game.start();
});
//Move player to another team
mp.events.addCommand('move',(player,str) => {
    if(!player.admin) return player.outputChatBox(`!{#FF0000}You must be admin to use this command.`);
    var args = str.split(" ");
    var team;
    var targetName = args[0];
    args.splice(0,1);
    if(args.length > 0)
        team = args.join(" ");
    if(!team)
    {
        team = targetName;
        targetName = player.name;
    }
    var target = mp.fcbn(targetName);
    if(!target)
    {
        player.outputChatBox(`Could not find player by name '${targetName}'`);
        return;
    }

    var real = undefined;
    mp.Game.teams.forEach(t => {
        if(t.name.toLowerCase() == team.toLowerCase())
            real = t;
    });
    if(!real)
    {
        player.outputChatBox(`Could not find team '${team}'`);
        return;
    }
    mp.Game.moveTeam(target,real);
    if(player != target)
        player.outputChatBox(`Moved !{#FFFF00}${target.name}!{#FFFFFF} to team !{#${real.teamColor}}${real.name}`);
    target.outputChatBox(`!{#FFFF00}${player.name}!{#FFFFFF} moved you to team !{#${real.teamColor}}${real.name}`);
});
//Cleanup all objects in minigame (Remove this soon)
mp.events.addCommand('cleanup', (player) => {
    if(!player.admin) return player.outputChatBox(`!{#FF0000}You must be admin to use this command.`);
    mp.players.broadcast(`There are ${mp.Game.gameObjects.length} objects spawned.`);
    mp.Game.cleanUp();
});