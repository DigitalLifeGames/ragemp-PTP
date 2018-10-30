var assert = require("assert");
var GameState = require("packages/ptp/main/state.js").GameState;


describe('Team Balance Tests',() => {
    describe('Game starts 4 players',() => {
        it('should teams be even',function () {
            let Game = new GameState();

            assert.equal([1,1,1,1],[Game.teams[0].length,Game.teams[1].length,Game.teams[2].length,Game.teams[3].length]);
        });
    });
    describe('Player Joins',() => {
        it('should teams be even',function () {
            assert.equal(1,1);
        });
    })
    describe('Player Leaves',() => {
        it('should teams be even',function () {
            assert.equal(1,1);
        });
    })
});