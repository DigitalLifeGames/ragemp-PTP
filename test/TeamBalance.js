var assert = require("assert");
mp = require("./mock/Multiplayer.js");
var GameState = require("../packages/ptp/main/state.js").GameState;


describe('Team Balance Tests',() => {
    describe('Game starts 5 players',() => {
        it('should teams be even',function () {

            var expected = [1,1,1,1,1];

            let Game = new GameState();

            Game.add(new mp.Player("Plornt"));
            Game.add(new mp.Player("Schamens"));
            Game.add(new mp.Player("Mercury"));
            Game.add(new mp.Player("Tricky"));
            Game.add(new mp.Player());

            Game.teamBalance();

            
            var actual = [Game.teams[0].length,Game.teams[1].length,Game.teams[2].length,Game.teams[3].length,Game.teams[4].length];
            assert.deepEqual(actual,expected);
        });
    });
    describe('Game starts 2 players',() => {
        it('should teams be President, Terrorist',function () {

            var expected = [1,1,0,0,0];

            let Game = new GameState();

            Game.add(new mp.Player("Plornt"));
            Game.add(new mp.Player("Schamens"));

            Game.teamBalance();

            var teams = Game.teams;
            var actual = [teams[0].length,teams[1].length,teams[2].length,teams[4].length];

            console.log(actual);
            assert.deepEqual(actual,expected);
        });
    });
});