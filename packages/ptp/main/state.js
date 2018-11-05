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
                    this.gameObjects.push(mp.vehicles.new(mp.joaat(veh.datablock), veh.position));
                } catch(e) {
                    Console.log("Unhandled error (state.js)");
                }
            });
        });

        if(this.minPlayers > this.players.length)
        {
            this.state = 1;
            MessageAll(`Not enough players to start ptp (${this.players.length}/${this.minPlayers})`);
            return false;
        }
        this.teamBalance();
        this.state = 2;
        Console.log("Protect the President has begun...");
        this.running = setInterval(this.tick,1000);
        return true;
    }
    tick() {
        //For every player...
        mp.players.forEach( (player, id) => {
            //Check if his/her blip exists and if they are alive...
            if (player.blip && player.health > 0) {
                //And update the blip position
                player.blip.position = player.position;
            
                //Quick note: The 'player.health > 0' was necessary
                //because if we dont do that the server just crashes.
                //Looks like we can't get player position if he/she is dead.
            }
	    });
    }
    //Balances the teams, does not rearrange teams
    teamBalance() {
        var exclude = [];

        //Autofill all required teams
        this.teams.forEach(team => {
            if(team.length < team.minPlayers)
            {
                while(team.length < team.minPlayers)
                {
                    var pl = this.random(exclude);
                    if(!pl)
                    {
                        Console.log(`Not enough players for team ${team.name}`);
                        return;
                    }
                    else
                        this.moveTeam(pl,team);
                }
            }
            exclude.push(team);
        });

        //Check teams that have capacity
        var open = [];
        this.teams.forEach(team => {
            if(team.length < team.maxPlayers || !team.maxPlayers)
                open.push(team);
        });


        //Gather rest of the players
        this.players.forEach(pl => {
            if(this.teams.indexOf(this.getTeam(pl)) == -1)
            {
                this.teams.forEach(t => {
                    if(t.length == 0)
                        this.moveTeam(pl,t);
                });
                if(this.teams.indexOf(pl.team) != -1)
                    return;
                var rTeam = open[Math.floor(open.length * Math.random())];
                this.moveTeam(pl,rTeam);
                if(rTeam.maxPlayers != false && rTeam.length >= rTeam.maxPlayers)
                    open.splice(open.indexOf(rTeam),1);
            }
        });
        
        Console.log("-- Team Balance Report --");
        Console.log(`-- ${this.players.length} total players`);
        this.teams.forEach(team => {
            var str = "";
            team.forEach(pl => str += pl.name + " | ");
            Console.log("-- " + team.length + ": " + team.name + " | " + str);
        });
        Console.log("-- " + this.gameObjects.length + " objects --")
        Console.log("-------------------------");
    }
    /*   teamBalance() {
        
        var exclude = [];

        //Gather rest of the players
        for(var pid=0;pid<this.players.length;pid++)
        {
            var pl = this.players[pid];

            //Check if player HAS a team
            if(pl.team)
                continue;

            var open = [];
            var required = [];
            for(var tid=0;tid<this.teams.length;tid++)
            {
                var team = this.teams[tid];
                
                //Check if it NEEDS people
                if(team.length < team.minPlayers)
                {
                    open.push(team);
                    required.push(team);
                    break;
                }
                else if(required.indexOf(team) != -1)
                    required.splice(required.indexOf(team),1);
                //Check if it has ANY people (TODO: Include weights)
                if(team.length < 1 && required.length == 0)
                {
                    open.push(team);
                    break;
                }
                //Check if it can have MORE people
                if(team.length < team.maxPlayers || !team.maxPlayers)
                {
                    open.push(team);
                }
            }
            if(open.length == 0)
                break;
            var rTeam = open[Math.floor(open.length * Math.random())];
            this.moveTeam(pl,rTeam);
        }

        Console.log("-- Team Balance Report --");
        Console.log(`-- ${this.players.length} total players`);
        this.teams.forEach(team => {
            var str = "";
            team.forEach(pl => str += pl.name + " | ");
            Console.log("-- " + team.length + ": " + team.name + " | " + str);
        });
        Console.log("-- " + this.gameObjects.length + " objects --")
        Console.log("-------------------------");
     */
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
        Console.log("[PTP] " + text);
        this.players.forEach((p) => p.outputChatBox(text));
    }
    setPresident(player) {
        Console.log(`${player.name} is now President!`);
        this.moveTeam(player,President);
        //this.message("President has spawned");
    }
    moveTeam(player,team) {
        if(this.getTeam(player))
            this.getTeam(player).splice(this.getTeam(player).indexOf(player),1);
        player.team = team;
        player.setVariable("currentTeam",team.name);
        team.push(player);   
        player.outputChatBox(`<b>You are now on ${team.name}!</b>`);
        
        var spawns = team.spawns;
        var spawn = spawns[Math.floor(spawns.length * Math.random())];
        player.spawn(spawn);

        //Blip
        if(player.blip)
        {
            try {
            player.blip.destroy();
            }
            catch(e) {
                console.log("Blip Error:",e);
            }
            player.blip = undefined;
        }
        if(team.hidden != false)
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
        if(team.weapons)
            team.weapons.forEach(wep => {
            player.giveWeapon(mp.joaat(wep.datablock),wep.ammo);
        });
        // both strings and numbers should work
        //player.setVariable("currentTeam", player.team);
    }

    getTeam(player)
    {
        for(var i=0;i<this.teams.length;i++)
        {
            if(this.teams[i].name == player.getVariable("currentTeam"))
                return this.teams[i];
        }
        return false;
    }
    
    random(excludeTeams) {
        var players = [];
        this.players.forEach(pl =>
        {
            if(excludeTeams.indexOf(this.getTeam(pl)) == -1 || !this.getTeam(pl) || excludeTeams == undefined)
                players.push(pl);
        });
        if(players.length == 0)
            return false;
        var target = players[Math.floor(players.length * Math.random())];

        //Console.log(players[1]);
        if(!target)
        {
            //Console.log("something broke idk");
            //var stack = new Error().stack
            //Console.log( stack );
        }
        return target;

    }
    add(player) {
        if(this.players.indexOf(player) != -1)
            return;
        this.players.push(player);
        if(this.state == 1) //waiting to start
            return this.start();
        
        this.teamBalance();
    }
    remove(player) {
        var t = this.getTeam(player);
        if(t)
        {
            t.splice(t.indexOf(player),1);
        }
        this.players.splice(this.players.indexOf(player),1);
        this.teamBalance();
        //if(this.minPlayers > players.length)
    }
    endRound(winner) {
        //Clean up
        this.cleanUp();
        
        if(winner)
        {}
    }
    end() {
        this.endRound();
        //Remove all players
        this.players.forEach(pl => {
            pl.game = undefined;
            
        });
        MessageAll("Protect the President has ended.");
    }

}
module.exports.GameState = GameState;