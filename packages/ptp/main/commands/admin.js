//Spawn vehicle by name
mp.events.addCommand('veh', (player, _, vehName) => {
    if(player.admin)
    {
        var v = mp.vehicles.new(mp.joaat(vehName), player.position);
        mp.Game.gameObjects.push(v);
        player.outputChatBox(`!{#00FF00}Vehicle spawned!`);
    }
    else
        player.outputChatBox(`!{#FF0000}You must be admin to use this command.`);
});
//Teleport to another user
mp.events.addCommand('tp',(player,location) => {
    if(!player.admin) return player.outputChatBox(`!{#FF0000}You must be admin to use this command.`);
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

//Admin a user
mp.events.addCommand('admin',(player,targetName) => {
    if(!player.admin) return player.outputChatBox(`!{#FF0000}You must be admin to use this command.`);
    var target = mp.fcbn(targetName);
    if(!target) {
        return player.outputChatBox(`!{#FF0000}Could not find user by name ${Colors.yellow + targetName + Colors.red}.`);
    }
    else if(target == player) {
        return player.outputChatBox(`!{#FF0000}You cannot change your own status!`);
    }
    else
    {
        var db = CurrentGame.database();
        if(!db)
            return player.outputChatBox(`!{#FF0000}Not currently connected to the database!`);
        db.setAdmin(target.name,1).then(() => {
            MessageAll(`!{#FFFF00}${target.name} !{#00FF00}is now admin`);
        });
    }
});
//Remove admin
mp.events.addCommand('unadmin',(player,targetName) => {
    if(!player.admin) return player.outputChatBox(`!{#FF0000}You must be admin to use this command.`);
    var target = mp.fcbn(targetName);
    if(!target) {
        return player.outputChatBox(`!{#FF0000}Could not find user by name ${Colors.yellow + targetName + Colors.red}.`);
    }
    else if(target == player) {
        return player.outputChatBox(`!{#FF0000}You cannot change your own status!`);
    }
    else
    {
        var db = CurrentGame.database();
        if(!db)
            return player.outputChatBox(`!{#FF0000}Not currently connected to the database!`);
        db.setAdmin(target.name,0).then(() => {
            MessageAll(`!{#FFFF00}${target.name} !{#00FF00}is no longer admin`);
        });
    }
});



//TEMPORARY DATABASE VEHICLE COMMANDS
mp.events.addCommand('s',(player,saveteam) => {
    if(!player.admin) return player.outputChatBox(`!{#FF0000}You must be admin to use this command.`);
    var veh = player.vehicle;
    if(!veh)
    {
        player.outputChatBox("You are not in a vehicle!");
        return;
    }
    var pos = veh.position;
    var rot = veh.rotation;
    var db = veh.model;

    var position = `${Math.floor(pos.x)} ${Math.floor(pos.y)} ${Math.floor(pos.z)}`;
    var rotation = `${Math.floor(rot.x*100)/100} ${Math.floor(rot.y*100)/100} ${Math.floor(rot.z*100)/100}`;

    var team = undefined;
    if(saveteam && mp.Game.getTeam(player))
        team = mp.Game.getTeam(player).name;
    if(CurrentGame.database())
        CurrentGame.database().insert("vehicles",{
        datablock: db,
        position: position,
        rotation: rotation,
        team: team
    }).then(() => {
        player.outputChatBox(`Added vehicle to database !{#FFFF00}${db}!{#FFFFFF}. ${team != undefined ? `For team: !{#${mp.Game.getTeam(player).teamColor}}${team}`:""}`);
    }).catch(() => {
        player.outputChatBox("Could not add vehicle to database.");
    });
});
mp.events.addCommand('d',(player) => {
    if(!player.admin) return player.outputChatBox(`!{#FF0000}You must be admin to use this command.`);
    var veh = player.vehicle;
    if(!veh)
    {
        player.outputChatBox("You are not in a vehicle!");
        return;
    }
    if(!veh.databaseId)
    {
        player.outputChatBox("We do not have a record of this vehicle in the database!");
        return;   
    }
    if(CurrentGame.database())
        CurrentGame.database().delete("vehicles",{
            id: veh.databaseId
        }).then(() => {
            player.outputChatBox(`Removed vehicle from database. ID: !{#FFFF00}${veh.databaseId}`);
            veh.databaseId = undefined;
        }).catch(() => {
            player.outputChatBox(`!{#FF0000}Could not removed vehicle from database. ID: !{#FFFF00}${veh.databaseId}`);
    });
});