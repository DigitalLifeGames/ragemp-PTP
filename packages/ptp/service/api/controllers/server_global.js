/**
* @swagger
* /server/players:
*   get:
*     tags:
*       - Server
*     description: Return all players currently on the server
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Users currently on server
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/Player'
*           
*/
function Players(req, res) {
    var data = {
        players: []
    };
    mp.players.forEach(pl => {
        data.players.push({
            ip: pl.ip,
            name: pl.name,
            admin: pl.admin,
            logged: pl.logged,
            locked: pl.locked
        });
    });
    res.json(data);
}
/**
 * @swagger
 * /server/time:
 *   get:
 *     tags:
 *       - Server
 *     description: Retrieve current runtime of server
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Time in seconds
 *         schema:
 *           type: integer
 *           
 */
function Time(req,res) {
    res.send(`${process.uptime()}`);
}
module.exports = function(app) {
    app.route('/server/players').get(Players);
    app.route('/server/time').get(Time);
};