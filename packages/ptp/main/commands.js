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
mp.events.addCommand('tp',(player,location) => {
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
mp.events.addCommand('reload',(player,config) => {
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
mp.events.addCommand('move',(player,str) => {
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
    target.outputChatBox(`Moved to team ${real.name}`);
});
mp.events.addCommand('teams',(player) => {
    mp.Game.teams.forEach(t => {
        player.outputChatBox(`|| ${t.name}: ${t.length} players`);
    });
});
mp.events.addCommand('signup',(player,password) => {
    if(!password || password.length < 6)
    {
        player.outputChatBox("Your password must be at least 6 characters.");
        return;
    }
    Database.createAccount({
        username: player.name,
        password: password
    }).then(() => {
        player.outputChatBox("Account created successfully!");
    }).catch((error) => {
        player.outputChatBox(`Your account already exists. Please use /login or /changepassword`);
    });
});