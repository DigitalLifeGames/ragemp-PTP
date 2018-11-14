var assert = require("assert");
global.Console = require("../packages/ptp/main/models/Logger.js").Console;
mp = require("./mock/Multiplayer.js");
var GameState = require("../packages/ptp/main/state.js").GameState;
var preferences = require("../packages/ptp/configs/default.js");

//Disable logging
Console.log = () => {}
global.Database = undefined;
describe('Team Balance Tests',() => {
    
    it('1 Player: Doesn\'t start',function () {

        var expected = [0,0,0,0,0];

        let Game = new GameState({
            teams : [{
                minPlayers: 1,
                maxPlayers: 1,
                name: "President",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                maxPlayers: 1,
                name: "Vice President",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 1,
                maxPlayers: false,
                name: "Terrorist",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                name: "Security",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                name: "Police",
                spawns: [new mp.Vector3(0,0,0)]
            }]
        });

        Game.teamBalance();

        var teams = Game.teams;
        var actual = [teams[0].length,teams[1].length,teams[2].length,teams[3].length,teams[4].length];

        Game.end();
        assert.deepEqual(actual,expected);
    });
    it('should never have same President',function () {

        let Game = new GameState(preferences);
        
        Game.add(new mp.Player("Plornt"));
        Game.add(new mp.Player("Schamens"));
        Game.add(new mp.Player("Tricky"));
        Game.add(new mp.Player("Mercury"));
        Game.add(new mp.Player("Seth"));
        Game.add(new mp.Player("Paul"));
        Game.add(new mp.Player("Mike"));
        Game.add(new mp.Player("Timmy"));
        //Rounds
        var rounds = 5;
        for(var i=0;i<rounds;i++)
        {
            if(!Game.start())
                assert.fail("Could not start mock game");
            Game.endRound(Game.teams.President);
        }
        //Make sure president is never the same
        var presidents = Game.presidentHistory;
        for(var i=0;i<presidents.length;i++)
        {
            var president = presidents[i];
            if(i > 1)
            {
                var last = presidents[i-1];
                if(president == last) {
                    assert.fail("Consecutive president found.");
                    return;
                }
            }
        }
        Game.state = 0;
        Game.end();
        assert.equal(1,1);
        //mp.players._items.splice(0,mp.players.length);
    });
    return;
    it('2 Player: President, Terrorist',function () {

        var expected = [1,1,0,0,0];

        let Game = new GameState({
            teams : [{
                minPlayers: 1,
                maxPlayers: 1,
                name: "President",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                maxPlayers: 1,
                name: "Vice President",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 1,
                maxPlayers: false,
                name: "Terrorist",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                name: "Security",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                name: "Police",
                spawns: [new mp.Vector3(0,0,0)]
            }]
        });

        Game.add(new mp.Player("Plornt"));
        Game.add(new mp.Player("Schamens"));

        Game.teamBalance();

        var teams = Game.teams;
        var actual = [teams[0].length,teams[1].length,teams[2].length,teams[3].length,teams[4].length];

        assert.deepEqual(actual,expected);
    });

    return;
    it('3 Player: President, 2 Terrorist',function () {

        var expected = [2,1,0,0,0];

        let Game = new GameState({
            teams : [{
                minPlayers: 1,
                maxPlayers: 1,
                name: "President",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                maxPlayers: 1,
                name: "Vice President",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 1,
                maxPlayers: false,
                name: "Terrorist",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                name: "Security",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                name: "Police",
                spawns: [new mp.Vector3(0,0,0)]
            }]
        });

        Game.add(new mp.Player("Plornt"));

        Game.teamBalance();

        var teams = Game.teams;
        var actual = [teams[0].length,teams[1].length,teams[2].length,teams[3].length,teams[4].length];

        assert.deepEqual(actual,expected);
    });
    it('4 Player: President, Vice President, 2 Terrorist',function () {

        var expected = [0,0,0,0,0];

        let Game = new GameState({
            teams : [{
                minPlayers: 1,
                maxPlayers: 1,
                name: "President",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                maxPlayers: 1,
                name: "Vice President",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 1,
                maxPlayers: false,
                name: "Terrorist",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                name: "Security",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                name: "Police",
                spawns: [new mp.Vector3(0,0,0)]
            }]
        });

        Game.add(new mp.Player("Plornt"));

        Game.teamBalance();

        var teams = Game.teams;
        var actual = [teams[0].length,teams[1].length,teams[2].length,teams[3].length,teams[4].length];

        assert.deepEqual(actual,expected);
    });
    it('5 Player: President, Vice President, Security, 2 Terrorist',function () {

        var expected = [0,0,0,0,0];

        let Game = new GameState({
            teams : [{
                minPlayers: 1,
                maxPlayers: 1,
                name: "President",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                maxPlayers: 1,
                name: "Vice President",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 1,
                maxPlayers: false,
                name: "Terrorist",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                name: "Security",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                name: "Police",
                spawns: [new mp.Vector3(0,0,0)]
            }]
        });

        Game.add(new mp.Player("Plornt"));

        Game.teamBalance();

        var teams = Game.teams;
        var actual = [teams[0].length,teams[1].length,teams[2].length,teams[3].length,teams[4].length];

        assert.deepEqual(actual,expected);
    });
    it('6 Player: President, Vice President, Security, 3 Terrorist',function () {

        var expected = [0,0,0,0,0];

        let Game = new GameState({
            teams : [{
                minPlayers: 1,
                maxPlayers: 1,
                name: "President",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                maxPlayers: 1,
                name: "Vice President",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 1,
                maxPlayers: false,
                name: "Terrorist",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                name: "Security",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                name: "Police",
                spawns: [new mp.Vector3(0,0,0)]
            }]
        });

        Game.add(new mp.Player("Plornt"));

        Game.teamBalance();

        var teams = Game.teams;
        var actual = [teams[0].length,teams[1].length,teams[2].length,teams[3].length,teams[4].length];

        assert.deepEqual(actual,expected);
    });
    it('7 Player: President, Vice President, Security, Police, 3 Terrorist',function () {

        var expected = [0,0,0,0,0];

        let Game = new GameState({
            teams : [{
                minPlayers: 1,
                maxPlayers: 1,
                name: "President",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                maxPlayers: 1,
                name: "Vice President",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 1,
                maxPlayers: false,
                name: "Terrorist",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                name: "Security",
                spawns: [new mp.Vector3(0,0,0)]
            },{
                minPlayers: 0,
                name: "Police",
                spawns: [new mp.Vector3(0,0,0)]
            }]
        });

        Game.add(new mp.Player("Plornt"));

        Game.teamBalance();

        var teams = Game.teams;
        var actual = [teams[0].length,teams[1].length,teams[2].length,teams[3].length,teams[4].length];

        assert.deepEqual(actual,expected);
    });

    /*
    describe('Game starts 2 players',() => {
        it('should teams be President, Terrorist',function () {

            var expected = [1,1,0,0,0];

            let Game = new GameState({
                teams : [{
                    minPlayers: 1,
                    maxPlayers: 1,
                    name: "President",
                    spawns: [new mp.Vector3(0,0,0)]
                },{
                    minPlayers: 0,
                    maxPlayers: 1,
                    name: "Vice President",
                    spawns: [new mp.Vector3(0,0,0)]
                },{
                    minPlayers: 1,
                    maxPlayers: false,
                    name: "Terrorist",
                    spawns: [new mp.Vector3(0,0,0)]
                },{
                    minPlayers: 0,
                    name: "Security",
                    spawns: [new mp.Vector3(0,0,0)]
                },{
                    minPlayers: 0,
                    name: "Police",
                    spawns: [new mp.Vector3(0,0,0)]
                }]
            });

            Game.add(new mp.Player("Plornt"));
            Game.add(new mp.Player("Schamens"));

            Game.teamBalance();

            var teams = Game.teams;
            var actual = [teams[0].length,teams[1].length,teams[2].length,teams[3].length,teams[4].length];

            assert.deepEqual(actual,expected);
        });
        it('Prefs changed, should teams be Terrorist, Police',function () {

            var expected = [1,1,0,0,0];

            preferences.teams.forEach(t => {
                if(t.name == "Terrorist" || t.name == "Police")
                    t.minPlayers = 1;
                else
                    t.minPlayers = 0;
            });

            let Game = new GameState({
                teams : [{
                    minPlayers: 0,
                    maxPlayers: 1,
                    name: "President",
                    spawns: [new mp.Vector3(0,0,0)]
                },{
                    minPlayers: 0,
                    maxPlayers: 1,
                    name: "Vice President",
                    spawns: [new mp.Vector3(0,0,0)]
                },{
                    minPlayers: 1,
                    maxPlayers: false,
                    name: "Terrorist",
                    spawns: [new mp.Vector3(0,0,0)]
                },{
                    minPlayers: 0,
                    name: "Security",
                    spawns: [new mp.Vector3(0,0,0)]
                },{
                    minPlayers: 1,
                    name: "Police",
                    spawns: [new mp.Vector3(0,0,0)]
                }]
            });

            Game.add(new mp.Player("Plornt"));
            Game.add(new mp.Player("Schamens"));


            Game.teamBalance();

            var teams = Game.teams;
            var actual = [teams[0].length,teams[1].length,teams[2].length,teams[3].length,teams[4].length];

            assert.deepEqual(actual,expected);
            
            assert.equal(true,(teams[0].name == "Terrorist" || teams[0].name == "Police"));
            assert.equal(true,(teams[1].name == "Terrorist" || teams[1].name == "Police"));
        });
    });

    describe('Game starts 3 players',() => {
        it('should teams be President, Terrorist, Police',function () {

            var expected = [1,1,0,0,1];

            let Game = new GameState({
                teams : [{
                    minPlayers: 1,
                    maxPlayers: 1,
                    name: "President",
                    spawns: [new mp.Vector3(0,0,0)]
                },{
                    minPlayers: 0,
                    maxPlayers: 1,
                    name: "Vice President",
                    spawns: [new mp.Vector3(0,0,0)]
                },{
                    minPlayers: 1,
                    maxPlayers: false,
                    name: "Terrorist",
                    spawns: [new mp.Vector3(0,0,0)]
                },{
                    minPlayers: 0,
                    name: "Security",
                    spawns: [new mp.Vector3(0,0,0)]
                },{
                    minPlayers: 0,
                    name: "Police",
                    spawns: [new mp.Vector3(0,0,0)]
                }]
            });

            Game.add(new mp.Player("Plornt"));
            Game.add(new mp.Player("Schamens"));
            Game.add(new mp.Player("Tricky"));

            Game.teamBalance();

            var teams = Game.teams;
            var actual = [teams[0].length,teams[1].length,teams[2].length,teams[3].length,teams[4].length];

            assert.deepEqual(actual,expected);
        });
    });

    describe('Game starts 5 players',() => {
        it('should teams be even',function () {

            var expected = [1,1,1,1,1];

            let Game = new GameState({
                teams : [{
                    minPlayers: 1,
                    maxPlayers: 1,
                    name: "President",
                    spawns: [new mp.Vector3(0,0,0)]
                },{
                    minPlayers: 0,
                    maxPlayers: 1,
                    name: "Vice President",
                    spawns: [new mp.Vector3(0,0,0)]
                },{
                    minPlayers: 1,
                    maxPlayers: false,
                    name: "Terrorist",
                    spawns: [new mp.Vector3(0,0,0)]
                },{
                    minPlayers: 0,
                    name: "Security",
                    spawns: [new mp.Vector3(0,0,0)]
                },{
                    minPlayers: 0,
                    name: "Police",
                    spawns: [new mp.Vector3(0,0,0)]
                }]
            });

            Game.add(new mp.Player("Plornt"));
            Game.add(new mp.Player("Schamens"));
            Game.add(new mp.Player("Mercury"));
            Game.add(new mp.Player("Tricky"));
            Game.add(new mp.Player());

            Game.teamBalance();

            
            var actual = [Game.teams[0].length,Game.teams[1].length,Game.teams[2].length,Game.teams[3].length,Game.teams[4].length];

            true;
            assert.deepEqual(actual,expected);
        });
    });
    */
    
});