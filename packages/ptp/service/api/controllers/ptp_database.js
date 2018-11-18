/**
 * @swagger
 * /db/board:
 *   get:
 *     tags:
 *       - Database Service
 *     description: Returns scores from Leaderboard view within the database
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Array of PlayerScore objects
 *         schema:
 *           $ref: '#/definitions/PlayerScore'
 */
function Leaderboard(req,res)
{
    var game = req.app.get("service").game;
    var db = game.database();
    if(!db)
    {
        res.send({
            error: "No database available"
        });
        return;
    }
    db.select('Leaderboard').then(rows => {
        res.send(rows);
    });
}
module.exports = function(app) {
    app.route('/db/board').get(Leaderboard);
};