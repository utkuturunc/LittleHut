/**
 * @swagger
 * definitions:
 *   Attendee:
 *     type: object
 *     required:
 *       - name
 *       - profilePicture
 *     properties:
 *       name:
 *         type: string
 *       profilePicture:
 *         type: string
 *         format: url
 */

export interface Attendee {
  name: string
  profilePicture: string
}
