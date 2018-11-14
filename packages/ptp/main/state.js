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
        this.round = 1;
        this.roundLength = options.roundLength*60*1000;
        this.presidentHistory = [];
        options.teams.forEach(t => {
            var team = [];
            for(var prop in t)
                team[prop] = t[prop];
            this.teams.push(team);
            this.minPlayers += t.minPlayers;

            this.teams[team.name] = team;
        });
    }
    start() {
        this.state = 0;
        //Select all players
        mp.players.forEach((player) =>
        {
            if(this.players.indexOf(player) != -1)
                return;
            this.add(player);
        });

        //Clean up from previous rounds
        this.cleanUp();
        
        if(this.teamBalance() == false) {
            MessageAll(`Not enough players to start ptp (${this.players.length}/${this.minPlayers})`);
            this.state = 1; //waiting now
            return false;
        }

        //Spawn objects
        this.teams.forEach(team => team.vehicles.forEach(veh => {
            try {
                this.gameObjects.push(mp.vehicles.new(mp.joaat(veh.datablock), veh.position));
            } catch(e) {
                Console.log("Unhandled error (state.js)");
            }
        }));
        //TODO: Move this logic out of database...
        if(Database)
            Database.select("vehicles",{}).then((rows) => {
            rows.forEach(vehicleData => {
                var pos = vehicleData.position.split(" ");
                var rot = vehicleData.rotation.split(" ");
                var p = new mp.Vector3(Math.floor(pos[0]),Math.floor(pos[1]),Math.floor(pos[2]));
                var r = new mp.Vector3(rot[0],rot[1],rot[2]);

                var hash = parseInt(vehicleData.datablock);
                if(isNaN(hash))
                    hash = mp.joaat(vehicleData.datablock);
                var v = mp.vehicles.new(hash,p);
                v.rotation = r;
                v.position = p;
                if(!v)
                    Console.log(`Could not create vehicle entity for datablock [${vehicleData.datablock}]`);
                else
                {
                    v.databaseId = vehicleData.id;
                    this.gameObjects.push(v);
                }
            });
            Console.debug(`Loaded ${rows.length} vehicles from database.`);
        }).catch(err => {
            Console.log("Could not load vehicles from database.");
        });

        this.timeAlerts = 0;
        this.state = 2;
        Console.log("Protect the President has begun...");
        clearTimeout(this.running);
        clearInterval(this.running);
        this.running = setInterval(this.tick.bind(this),100);
        this.startTime = Date.now();
        return true;
    }
    tick() {
        if(this.state < 1) //Not running or waiting?
        {
            //This should never get called. remove this and make sure it doesn't get called
            clearTimeout(this.running);
            clearInterval(this.running);
            return;
        }
        //Update all blips
        this.players.forEach(player => {
            var blip = this.getBlip(player);
            if(blip)
            {
                var p = player.position;
                blip.position = new mp.Vector3(p.x,p.y,p.z);
            }
        });

        //Check time left
        var now = Date.now();
        var progress = (now-this.startTime)/(this.roundLength);
        if(progress > 1)
        {
            this.outOfTime();
        }
        else {
            var left = Math.ceil((this.roundLength-(now-this.startTime))/60/1000);
            if(left == 5 && this.timeAlerts < 1 && this.timeAlerts != false)
            {
                MessageAll(`!{#DDDDDD}${left}!{#FFFFFF} minutes remain!`);
                this.timeAlerts = 1;
            }
            if(left == 10 && this.timeAlerts < 2 && this.timeAlerts != false)
            {
                this.timeAlerts = 2;
                MessageAll(`!{#DDDDDD}${left}!{#FFFFFF} minutes remain!`);
            }
        }
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
    outOfTime()
    {
        var winner;
        //President wins
        this.teams.forEach(t => {
            if(t.name == "President")
                winner = t;
        });
        MessageAll("!{#CCCCCC}The round has ended! !{#FFFF00}President !{#FFFFFF}has survived!");
        this.endRound(winner);
    }
    //Balances the teams, does not rearrange teams
    teamBalance() {
        var exclude = [this.teams.President];

        var t = this;
        //Pick president
        if(this.teams.President.length == 0 && !this.pickPresident()) return false;

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
            //console.error(e);
            //console.log(e.message);
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
                if(team.length == 0 && team.autoAssign != false)
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
    pickPresident() {
        if(this.players.length == 0)
            return false;
        function rand(grp) {
            var seed = Math.random();
            seed = Math.random();
            seed = Math.random();
            var idx = Math.floor(seed * grp.length);
            return grp[idx];
        }

        var lookback = 5;
        var canidates = [];
        if(this.players.length < lookback)
            lookback = this.players.length-1;
        var ignore = this.presidentHistory.slice(this.presidentHistory.length-lookback,this.presidentHistory.length);
        this.players.forEach(pl => {
            
            if(ignore.indexOf(pl.name) != -1)
                return;
            canidates.push(pl);
        });
        if(canidates.length == 0)
        {
            //Select from anyone?
            canidates = this.players;
        }
        var president = rand(canidates);
        this.moveTeam(president,this.teams.President);
        return true;
    }
    cleanUp() {
        clearTimeout(this.running);
        clearInterval(this.running);
        //Clear all teams
        this.teams.forEach((team) => {
            team.forEach(pl => {
                pl.team = undefined
                pl.kills = 0;
            });
            team.splice(0,team.length);
        });
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
        if(team.maxPlayers === 1)
            player.outputChatBox(`You are now the !{#${team.teamColor}}${team.name}!{#FFFFFF}!`);
        else
            player.outputChatBox(`You are now on !{#${team.teamColor}}${team.name}!{#FFFFFF}!`);
        
        var spawns = team.spawns;
        var spawn = spawns[Math.floor(spawns.length * Math.random())];
        player.spawn(spawn);

        //Blip
        this.removeBlip(player);
        if(team.hidden != false)
            this.createBlip(player);
        
        mp.Game.spawnPlayer(player);
    }
    spawnPlayer(player) {
        var team = this.getTeam(player);
        if(!team)
            return;
        //Skin
        var skins = team.skins;
        var skin = skins[Math.floor(skins.length * Math.random())];
        player.model = mp.joaat(skin);
        player.health = 100;
        player.dimension = 0;

        //Determine spawn point
        var spawns = team.spawns;
        var spawnPos = spawns[Math.floor(spawns.length * Math.random())];
        if(!spawnPos)
            spawnPos = new mp.Vector3(0,0,0);

        //Add variance to spawn position
        var radius = (x) => Math.floor(x*2*Math.random())-x;

        spawnPos.x += radius(100)/100;
        spawnPos.y += radius(100)/100;
        

        //Respawn player
        player.spawn(spawnPos);
        player.dimension = 0;
        player.health = 100;
        player.armour = team.armour;
        

        //Weapons
        player.removeAllWeapons();
        if(team.weapons)
            team.weapons.forEach(wep => {
            player.giveWeapon(mp.joaat(wep.datablock),wep.ammo);
        });
    }
    playerDeath(player,killer) {
        if(!killer)
            killer = player;
        else
            killer.kills++;
        var team = this.getTeam(player);
        var enemy = this.getTeam(killer);
        MessageAll(`!{#${enemy.teamColor}}${killer.name}!{#FF0000} killed !{#${team.teamColor}}${player.name} `);
        if(team.name == "President")
        {
            //Check for vice president
            var vp;
            this.teams.forEach(t => {
                if(t.name == "Vice President" && t.length > 0)
                    vp = t[0];
            });
            if(vp)
            {
                MessageAll(`The !{#FF0000}President !{#FFFFFF}has been killed! The !{#${vp.team.teamColor}}Vice President !{#FFFFFF}has assumed power...`);
                this.moveTeam(vp,player.team);
                //Remove team
                player.team.splice(player.team.indexOf(player),1);
                player.team = undefined;
                this.teamBalance();
            }
            else
            {
                MessageAll("The !{#FF0000}President !{#FFFFFF}has been killed!");
                this.endRound(this.teams.Terrorist);
            }
            return;
        }
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
        player.kills = 0;
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
        if(!this.teamBalance() && this.state > 1)
        {
            this.end();
        }
        

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
    getBlip(player) {
        var blips = this.blips;
        for(var i=0;i<blips.length;i++)
        {
            var blip = this.blips[i];
            if(blip && blip.name == player.name)
                return blip;
        }
        return false;
    }
    removeBlip(player) {
        var blip = this.getBlip(player);
        if(!blip)
            return true;
        blip.destroy();
        this.blips.splice(this.blips.indexOf(blip),1);
        return true;
    }
    endRound(winner) {
        
        if(this.state > 1)
        {
            if(!winner)
            {
                MessageAll(`This round is a draw.`);
            }
            else if(winner == this.teams.President)
            {
                if(winner.length == 0)
                {
                    console.log("Round ended with no winner");
                    MessageAll("Replicate this :501");
                }
                else
                    MessageAll(`!{#FFFF22}${winner[0].name}!{#FFFFFF}, the !{#${winner.teamColor}}${winner.name}!{#FFFFFF} has won.`);

                //Government wins
            }
            else
            {
                MessageAll(`The !{#${this.teams.Terrorist.teamColor}}Terrorists!{#FFFFFF} have won...`);

                //Terrorist wins
            }
            if(this.teams.President.length > 0)
            {
                this.presidentHistory.push(this.teams.President[0].name);
            }
            this.round++;
        }

        if(this.state < 2)
            return;

        //Apply everyones score
        this.players.forEach(pl => {
            if(!pl.kills)
                pl.kills = 0;

            var team = this.getTeam(pl);
            if(!team)
                return;
            var won = winner && team.teamDamageType == winner.teamDamageType;
            var score = {
                kills: pl.kills,
                president: team == this.teams.President ? 1:0,
                wins: won ? 1:0,
                losses: won ? 0:1,
                rounds: 1
            };

            if(Database)
                Database.addScore(pl.name,score).catch(err => {
                console.log(`Could not update score for user ${pl.name}`);
            });
        });

        //Clean up
        this.cleanUp();

        if(this.state > 0) //If it was running schedule another...
        {
            //Schedule another round
            var ms = 10000;
            MessageAll(`Round !{#FFFF00}${this.round}!{#FFFFFF} is scheduled to begin in ${Math.floor(ms/1000)} seconds...`);
            clearInterval(this.running);
            this.running = setInterval(this.reset.bind(this),ms);
        }
    }
    end() {
        this.state = 0;
        this.endRound();
        clearInterval(this.running);
        clearTimeout(this.running);
        this.schedule = undefined;
        //Remove all players
        this.players.forEach(pl => {
            pl.game = undefined;
            pl.team = undefined;
        });
        MessageAll("Protect the President has ended.");
    }
    
}
module.exports.GameState = GameState;