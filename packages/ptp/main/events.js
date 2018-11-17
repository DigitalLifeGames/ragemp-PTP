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

mp.events.add('playerJoin',(player) => {
    Console.log(`${player.name} has joined the server.`);
    mp.players.broadcast(`${player.name} has joined the server.`);

    if(mp.Game.state > 0)
        mp.Game.add(player);
    
    if(mp.Game.database())
        mp.Game.database().accountExists(player.name).then((data) => {
        var acc = data[0];
        if(acc.locked)
            player.outputChatBox("Type /login to login");
        else
        {
            player.outputChatBox("Type !{#FFFF00}/signup [password]!{#FFFFFF} to add a password!");
            player.logged = true;
        }
    }).catch(() => {
        //Create them an unsecure account
        mp.Game.database().createAccount({
            password: "",
            username: player.name
        }).then(() => {
            player.outputChatBox("Basic account has been created. Type !{#FFFF00}/signup [password]!{#FFFFFF} to add a password! We will begin tracking your stats and activity within the server to provide you the best experience possible.");
            player.logged = true;
            Console.log(`New player! Created an account for ${player.name}.`);
        }).catch((err) => {
            player.outputChatBox("!{#FF2222}An unknown error occured. Try to replicate this and report to an admin.");
            console.log(`Could not create unsecure account for ${player.name}`);
            console.error(err);
        });
    });
});
mp.events.add('playerQuit',(player) => {
    MessageAll(`!{#FFFF00}${player.name} !{#FFFFFF}has disconnected.`);
    mp.Game.remove(player);
});