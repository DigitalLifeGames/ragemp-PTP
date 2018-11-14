/**
 * @swagger
 * definitions:
 *   MinigameState:
 *     type: object
 *     required:
 *       - state
 *       - round
 *       - teams
 *       - players
 *     properties:
 *       state:
 *         type: integer
 *       round:
 *         type: integer
 *       teams:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Team'
 *       players:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Player'
 */
