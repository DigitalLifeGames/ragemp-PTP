var Game = mp.Game;

/**
 * @swagger
 * /ptp/state:
 *   get:
 *     tags:
 *       - Minigame Options
 *     description: Returns minigame state
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Integer representing the current state of PTP minigame
 *         schema:
 *           type:
 *              - integer
 */
function State(req,res) {
    res.json({
        state: mp.Game.state
    });
}
/**
 * @swagger
 * /ptp/current:
 *   get:
 *     tags:
 *       - Minigame Options
 *     description: Returns minigame state object containing all current information
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: MinigameState representing current state of the minigame
 *         schema:
 *           type:
 *              - integer
 */
function Current(req,res)
{
    var game = Game;
    var teams = game.teams.map(t => new Object({
        teamColor: t.teamColor,
        name: t.name,
        players: t.map(p => new Object({
            name: p.name,
            ip: p.ip,
            admin: p.admin,
            logged: p.logged 
         }))
    }));
    var players = game.players.map(p => new Object({
        name: p.name,
        ip: p.ip,
        admin: p.admin,
        logged: p.logged 
     }));
    var objects = game.gameObjects.map(e => new Object({
        type: e.type,
        model: e.model,
        position: e.position,
        rotation: e.rotation 
    }));

    res.send({
        state: game.state,
        round: game.round,
        teams: teams,
        players: players,
        gameObjects: objects
    });
}
module.exports = function(app) {
    app.route('/ptp/state').get(State);
    app.route('/ptp/current').get(Current);
};