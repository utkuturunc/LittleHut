/**
 * @swagger
 * definitions:
 *   Attendee:
 *     type: object
 *     required:
 *       - id
 *       - name
 *       - email
 *       - avatar
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       avatar:
 *         type: string
 *         format: url
 */

export interface Attendee {
  id: string
  name: string
  email: string
  avatar: string | null
}
