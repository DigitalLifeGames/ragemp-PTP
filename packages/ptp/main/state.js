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
    /*
    players = [];

    minPlayers = 1; //2
    state = 0;//0 - Not started | 1 - Waiting | 2 - Running
    gameObjects = [];
    */

    constructor(options) {
        //Load options
        options.teams = options.teams.sort((a,b)=> a.minPlayers < b.minPlayers);

        this.teams = [];
        this.minPlayers = 0;
        this.players = [];
        this.state = 0;
        this.gameObjects = [];
        options.teams.forEach(t => {
            var team = [];
            for(var prop in t)
                team[prop] = t[prop];
            this.teams.push(team);
            this.minPlayers += t.minPlayers;
        });
    }
    start() {
        //Select all players
        mp.players.forEach((player) =>
        {
            if(this.players.indexOf(player) != -1)
                return;
            player.outputChatBox("Welcome to PTP!");
            this.add(player);
            //this.message("Player was added to ptp...");
        });


        //Clean up
        this.cleanUp();

        //Clear all teams
        this.teams.forEach((team) => {
            team.splice(0,team.length);

            //Spawn vehicles
            team.vehicles.forEach(veh => {
                try {
                    this.gameObjects.push(mp.vehicles.new(veh.datablock, veh.position));
                } catch(e) {
                    console.log("Unhandled error (state.js)");
                }
            });
        });

        if(this.minPlayers > this.players.length)
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
    teamBalance() {
        var exclude = [];

        //Balance all teams to at least 1

        function determineNextTeam()
        {
            if(this.teams[0].length < 1)
                return Teams[0];
            if(Teams[1].length < 1)
                return Teams[1];
            if(Teams[2].length < 2)
                return Teams[2];
        }
        this.teams.forEach(team => {
            if(team.length < 1)
            {
                var pl = this.random(exclude);
                if(!pl)
                    console.log(`Not enough players for team ${team.name}`);
                else
                    this.moveTeam(pl,team);
            }
            exclude.push(team);
        });

        //Gather rest of the players
        this.players.forEach(pl => {
            if(this.teams.indexOf(pl.team) == -1)
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
        console.log(`-- ${this.players.length} total players`);
        this.teams.forEach(team => {
            var str = "";
            team.forEach(pl => str += pl.name + " | ");
            console.log("-- " + team.length + ": " + team.name + " | " + str);
        });
        console.log("-- " + this.gameObjects.length + " objects --")
        console.log("-------------------------");
    }
    cleanUp() {
        this.gameObjects.forEach(obj =>
        {
            obj.destroy();
        });
        this.gameObjects = [];
        //mp.vehicles.toArray().forEach(v => v.destroy());
    }
    reset() {
        this.message("Resetting PTP...");
        this.start();
    }
    message(text) {
        console.log("[PTP] " + text);
        this.players.forEach((p) => p.outputChatBox(text));
    }
    setPresident(player) {
        console.log(`${player.name} is now President!`);
        this.moveTeam(player,President);
        //this.message("President has spawned");
    }
    moveTeam(player,team) {
        if(player.team)
            player.team.splice(player.team.indexOf(player),1);
        player.team = team;
        team.push(player);   
        player.outputChatBox(`<b>You are now on ${player.team.name}!</b>`);

        var spawns = player.team.spawns;
        var spawn = spawns[Math.floor(spawns.length * Math.random())];
        player.spawn(spawn);

        //Blip
       // if(player.blip)
        //    player.blip.destroy();
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
    
    random(excludeTeams) {
        var players = [];
        this.players.forEach(pl =>
        {
            if(excludeTeams.indexOf(pl.team) == -1 || pl.team == undefined || excludeTeams == undefined)
                players.push(pl);
        });
        if(players.length == 0)
            return false;
        var target = players[Math.floor(players.length * Math.random())];

        //console.log(players[1]);
        if(!target)
        {
            //console.log("something broke idk");
            //var stack = new Error().stack
            //console.log( stack );
        }
        return target;

    }
    add(player) {
        if(this.players.indexOf(player) != -1)
            return;
        this.players.push(player);
        if(this.state == 1) //waiting to start
            return this.start();
    }
    remove(player) {
        this.players.splice(this.players.indexOf(player),1);

        //if(this.minPlayers > players.length)
    }

}
module.exports.GameState = GameState;