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
        this.blips = [];
        options.teams.forEach(t => {
            var team = [];
            for(var prop in t)
                team[prop] = t[prop];
            this.teams.push(team);
            this.minPlayers += t.minPlayers;
        });
    }
    start() {
        this.state = 0;
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

        if(this.teamBalance() == false)
        {
            this.state = 1;
            MessageAll(`Not enough players to start ptp (${this.players.length}/${this.minPlayers})`);
            return false;
        }
        this.state = 2;
        Console.log("Protect the President has begun...");
        this.running = setInterval(this.tick.bind(this),1000);
        return true;
    }
    tick() {

        //Update all blips
        this.players.forEach(player => {
            var blip = this.getBlip(player);
            if(blip)
            {
                var p = player.position;
                blip.position = new mp.Vector3(p.x,p.y,p.z);
            }
        });
        return;
        //For every player...
        mp.players.forEach( (player, id) => {
            //Check if his/her blip exists and if they are alive...

            return;
            if (player.blip && player.blip.position && player.health > 0) {
                //And update the blip position
                try {
                    player.blip.position = player.position;
                } catch(e) {
                    console.log("Error occured: ",e.message);
                    console.log("Player: ",player);
                    player.blip = undefined;
                }
            
                //Quick note: The 'player.health > 0' was necessary
                //because if we dont do that the server just crashes.
                //Looks like we can't get player position if he/she is dead.
            }
	    });
    }
    //Balances the teams, does not rearrange teams
    teamBalance() {
        var exclude = [];

        var t = this;
        //Autofill all required teams
        try {
            this.teams.forEach(team => {
                if(team.length < team.minPlayers)
                {
                    while(team.length < team.minPlayers)
                    {
                        var pl = this.random(exclude);
                        if(!pl)
                            throw new Error(`Not enough players for team ${team.name}`);
                        t.moveTeam(pl,team);
                    }
                }
                exclude.push(team);
            });
        } catch(e) {
            console.log(e.message);
            return false;
        }

        //Check teams that have capacity
        var open = [];
        this.teams.forEach(team => {
            if(team.length < team.maxPlayers || !team.maxPlayers)
                open.push(team);
        });


        var t = this;
        //Gather rest of the players
        this.players.forEach(pl => {
            if(t.getTeam(pl) != false)
                return;
            for(var i=0;i<t.teams.length;i++)
            {
                var team = t.teams[i];
                if(team.length == 0)
                {
                    t.moveTeam(pl,team);
                    break;
                }
            }
            if(t.getTeam(pl))
                return;
            var rTeam = open[Math.floor(open.length * Math.random())];
            t.moveTeam(pl,rTeam);
            if(rTeam.maxPlayers != false && rTeam.length >= rTeam.maxPlayers)
                open.splice(open.indexOf(rTeam),1);
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
        return true;
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
        this.gameObjects.forEach(function(obj)
        {
            if(obj)
                obj.destroy();
        });
        this.gameObjects = [];
        //mp.vehicles.toArray().forEach(v => v.destroy());
    }
    reset() {
        if(this.state > 1)
            this.end();
        this.message("Resetting PTP...");
        this.start();
    }
    message(text) {
        Console.log("[PTP] " + text);
        this.players.forEach((p) => p.outputChatBox(text));
    }
    moveTeam(player,team) {

        if(this.getTeam(player))
            this.getTeam(player).splice(this.getTeam(player).indexOf(player),1);
        player.team = team;
        player.setVariable("currentTeam",team.teamDamageType);
        team.push(player);   
        player.outputChatBox(`<b>You are now on ${team.name}!</b>`);
        
        var spawns = team.spawns;
        var spawn = spawns[Math.floor(spawns.length * Math.random())];
        player.spawn(spawn);

        //Blip
        this.removeBlip(player);

        if(team.hidden != false)
        {
            this.createBlip(player);
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
        //var t = player.getVariable("currentTeam");
        var t = player.team;
        if(!t)
            return false;
        return t;
        for(var i=0;i<this.teams.length;i++)
        {
            if(this.teams[i].name == t)
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
        if(this.state > 0)
            this.teamBalance();
    }
    remove(player) {
        var t = this.getTeam(player);
        if(t)
        {
            t.splice(t.indexOf(player),1);
        }
        this.players.splice(this.players.indexOf(player),1);
        if(!this.teamBalance())
        {
            this.end();
        }
        //if(this.minPlayers > players.length)

        this.removeBlip(player);
    }
    createBlip(player) {
        this.removeBlip(player);

        var p = player.position;
        var team = this.getTeam(player);
        if(!team)
        {
            console.log(`${player.name} does not have a team, cannot create blip!`);
            return false;
        }
        var blip = mp.blips.new(1, new mp.Vector3(p.x,p.y,p.z),
        {
            name: player.name,
            scale: 1,
            color: team.blipColor,
            alpha: 255,
        });
        
        this.blips.push(blip);
        return blip;
    }
    removeBlip(player) {
        var blip = this.getBlip(player);
        if(!blip)
            return true;
        blip.destroy();
        this.blips.splice(this.blips.indexOf(blip),1);
        return true;
    }
    getBlip(player) {
        var blips = this.blips;
        for(var i=0;i<blips.length;i++)
        {
            var blip = this.blips[i];
            if(blip.name == player.name)
                return blip;
        }
        return false;
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
            pl.team = undefined;
        });
        MessageAll("Protect the President has ended.");
    }

}
module.exports.GameState = GameState;