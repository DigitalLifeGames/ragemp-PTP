var President = [];
var VicePresident = [];
var Security = [];
var Police = [];
var Terrorist = [];


President.color = "yellow";
President.name = "President";
President.spawns = [new mp.Vector3(-427,1115,327)];
President.blipColor = 70;
President.weapons = [{
    datablock: 'knife',
    ammo: 1000
},{
    datablock: "heavyPistol",
    ammo: 1000
}];
President.vehicles = [
{
    position: new mp.Vector3(-399,1199,325),
    datablock: mp.joaat("FBI2")
},{
    position: new mp.Vector3(-396,1209,325),
    datablock: mp.joaat("FBI2")
},{
    position: new mp.Vector3(-404,1216,325),
    datablock: mp.joaat("baller5")
},{
    position: new mp.Vector3(-407,1206,325),
    datablock: mp.joaat("FBI")
},{
    datablock: mp.joaat("FBI"),
    position: new mp.Vector3(-405,1238,325),
},{
    datablock: mp.joaat("FBI2"),
    position: new mp.Vector3(-390,1191,325)
},{
    datablock: mp.joaat("FBI"),
    position: new mp.Vector3(-386,1201,325)
},{
    datablock: mp.joaat("FBI"),
    position: new mp.Vector3(-383,1214,325)
},{
    datablock: mp.joaat("FBI"),
    position: new mp.Vector3(-399,1235,325)
}];

VicePresident.color = "yellow";
VicePresident.name = "Vice President";
VicePresident.hidden = true;
VicePresident.spawns = [new mp.Vector3(-427,1110,327)];
VicePresident.weapons = [{
    datablock: 'micro_smg',
    ammo: 1000
}];
VicePresident.vehicles = [];

Security.color = "green";
Security.blipColor = 11;
Security.name = "Security";
Security.spawns = [new mp.Vector3(-422,1213,325)];
Security.weapons = [{
    datablock: 'micro_smg',
    ammo: 1000
}];
Security.vehicles = [];

Police.color = "blue";
Police.blipColor = 3;
Police.spawns = [new mp.Vector3(455,-1017,28)];
Police.name = "Police";
Police.weapons = [{
    datablock: 'micro_smg',
    ammo: 1000
}];
Police.vehicles = [{
    datablock: mp.joaat("Police3"),
    position: new mp.Vector3(446,-1025,28),
 },{
     datablock: mp.joaat("Police3"),
     position: new mp.Vector3(442,-1025,28),
 },{
    datablock: mp.joaat("Sheriff2"),
    position: new mp.Vector3(438,-1026,28),
 },{
     datablock: mp.joaat("Sheriff2"),
    position: new mp.Vector3(434,-1026,28),
 },{
    datablock: mp.joaat("PoliceT"),
    position: new mp.Vector3(431,-1027,28),
 },{
    datablock: mp.joaat("PoliceT"),
    position: new mp.Vector3(427,-1027,28),
 }];

Terrorist.name = "Terrorist";
Terrorist.color = "red";
Terrorist.blipColor = 6;
Terrorist.spawns = [new mp.Vector3(-497,-2187,8)];
Terrorist.weapons = [{
    datablock: 'micro_smg',
    ammo: 1000
}];
Terrorist.vehicles = [{
    datablock: mp.joaat("Cheetah"),
    position: new mp.Vector3(-510,-2176,7)
 },{
     datablock: mp.joaat("SultanRS"),
     position: new mp.Vector3(-513,-2179,7)
 },{
    datablock: mp.joaat("Bullet"),
    position: new mp.Vector3(-515,-2181,8)
 },{
     datablock: mp.joaat("Bati"),
    position: new mp.Vector3(-517,-2184,8)
 }];
var Teams = [President,Terrorist,VicePresident,Security,Police];


/*
President
The president, signified by a YELLOW marker, visible by larger size over any other class markers on the map, is the main target. One life, once killed, Vice President becomes the President.
Vice President
The vice president, invisible (NO BLIP) with a YELLOW marker, is to stay alive but CAN respawn if killed. If promoted to President, class is open and server is notified.
Security
Spawns with President and Vice, signified in GREEN, Main priority is to stay with the President and defend from any and all threats for the duration of the fifteen minutes the round lasts.
Police
Dignified in BLUE, can choose to hunt the Terrorists or simply assist in protecting the President.
Terrorist
Dignified in RED, main priority is to hunt and eliminate the President and anything in their path preventing them from doing that.
*/

class GameState
{
    players = [];

    minPlayers = 1; //2
    state = 0;//0 - Not started | 1 - Waiting | 2 - Running
    gameObjects = [];

    start = function()
    {
        var players = this.players;
        //Select all players
        mp.players.forEach((player) =>
        {
            if(players.indexOf(player) != -1)
                return;
            player.outputChatBox("Welcome to PTP!");
            players.push(player);
            //this.message("Player was added to ptp...");
        });

        //Clean up
        this.cleanUp();

        //Clear all teams
        Teams.forEach((team) => {
            team.splice(0,team.length);

            //Spawn vehicles
            team.vehicles.forEach(veh => {
                this.gameObjects.push(mp.vehicles.new(mp.joaat(veh.datablock), veh.position));
            });
        });


        if(this.minPlayers > players.length)
        {
            this.state = 1;
            console.log("Not enough players to start ptp");
            return;
        }
        this.teamBalance();
        this.state = 2;
        console.log("Protect the President has begun...");
    }
    //Balances the teams, does not rearrange teams
    teamBalance = () =>
    {
        var exclude = [];

        //Balance all teams to at least 1
        Teams.forEach(team => {
            if(team.length < 1)
                this.moveTeam(this.random(exclude),team);
            exclude.push(team);
        });

        //Gather rest of the players
        this.players.forEach(pl => {
            if(Teams.indexOf(pl.team) == -1)
            {
                //Determine team
                if(Terrorist.length < Security.length || Terrorist.length < Security.length+Police.length)
                    this.moveTeam(pl,Terrorist);
                else if(Security.length < Police.length)
                    this.moveTeam(pl,Security);
                else
                    this.moveTeam(pl,Police);
            }
        });

        console.log("-- Team Balance Report --");
        Teams.forEach(team => {
            var str = "";
            team.forEach(pl => str += pl.name + " | ");
            console.log("-- " + team.length + ": " + team.name + " | " + str + " --");
        });
        console.log("-- " + this.gameObjects.length + " objects --")
        console.log("-------------------------");
    }
    cleanUp = () =>
    {
        this.gameObjects.forEach(obj =>
        {
            obj.destroy();
        });
        this.gameObjects = [];
    }
    reset = () => {
        this.message("Resetting PTP...");
        this.start();
    }
    message = (text) => {
        console.log("[PTP] " + text);
        this.players.forEach((p) => p.outputChatBox(text));
    }
    setPresident = (player) =>
    {
        console.log(`${player.name} is now President!`);
        this.moveTeam(player,President);
        //this.message("President has spawned");
    }
    moveTeam = (player,team) =>
    {
        if(player.team)
            player.team.splice(player.team.indexOf(player),1);
        player.team = team;
        team.push(player);   
        player.outputChatBox(`<b>You are now on ${player.team.name}!</b>`);

        var spawns = player.team.spawns;
        var spawn = spawns[Math.floor(spawns.length * Math.random())];
        player.spawn(spawn);

        //Blip
        if(player.blip)
            player.blip.destroy();
        if(!team.hidden)
        {
            player.blip = mp.blips.new(1, player.position,
            {
                name: player.name,
                scale: 1,
                color: team.blipColor,
                alpha: 255,
            });
            this.gameObjects.push(player.blip);
        }

        //Weapons
        player.removeAllWeapons();
        team.weapons.forEach(wep => {
            player.giveWeapon(mp.joaat(wep.datablock),wep.ammo);
        });
    }
    
    random = (excludeTeams) => {
        var players = [];
        this.players.forEach(pl =>
        {
            if(excludeTeams.indexOf(pl.team) == -1 || pl.team == undefined || fromTeams == undefined)
                players.push(pl);
        });
        var target = players[Math.floor(players.length * Math.random())];
        return target;

    }
    add = (player) => {
        this.players.push(player);
        if(this.state == 1) //waiting to start
            return this.start();
    }
    remove = (player) => {
        this.players.remove(player);

        //if(this.minPlayers > players.length)
    }

}
module.exports.GameState = GameState;