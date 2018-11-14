/**
 * @swagger
 * definitions:
 *   Team:
 *     type: object
 *     required:
 *       - name
 *       - players
 *     properties:
 *       name:
 *         type: string
 *       teamColor:
 *         type: string
 *       players:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Player'
 */
