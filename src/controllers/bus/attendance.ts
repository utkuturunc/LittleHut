import { Context } from 'koa'
import * as KoaRouter from 'koa-router'
import { User } from '../../entities'
import { BusAttendance } from '../../entities/BusAttendance'
import { getAttendance, getUserStatusText, setBusAttendance } from '../../utils/attendance'

export const router = new KoaRouter()

/**
 * @swagger
 * /bus/attendance:
 *   get:
 *     description: Returns the attendance list
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: 'Value must be of format: Bearer token_comes_here'
 *         required: true
 *         schema:
 *           type: string
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Success Response
 *         headers:
 *           X-Refresh-Token:
 *             description: New extended token
 *             schema:
 *               type: string
 *         schema:
 *           type: object
 *           properties:
 *             attending:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Attendee'
 *             notAttending:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Attendee'
 *             pending:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Attendee'
 */

router.get('/', async (ctx: Context) => {
  ctx.body = await getAttendance()
})

/**
 * @swagger
 * /bus/attendance:
 *   post:
 *     description: Saves the attendance choice of the user. Overwrites if value exists
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: 'Value must be of format: Bearer token_comes_here'
 *         required: true
 *         schema:
 *           type: string
 *       - name: Body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             isAttending:
 *               type: boolean
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Success Response
 *         headers:
 *           X-Refresh-Token:
 *             description: New extended token
 *             schema:
 *               type: string
 *         schema:
 *           $ref: '#/definitions/BusAttendance'
 */
router.post('/', async (ctx: Context) => {
  const user: User = ctx.state.user
  if (!ctx.request.body) throw new Error('Validation error')
  const isAttending = ctx.request.body.isAttending
  ctx.body = await setBusAttendance(user, isAttending)
})

/**
 * @swagger
 * /bus/attendance/me:
 *   get:
 *     description: Returns the Attendance linked to current user
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: 'Value must be of format: Bearer token_comes_here'
 *         required: true
 *         schema:
 *           type: string
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Success Response
 *         headers:
 *           X-Refresh-Token:
 *             description: New extended token
 *             schema:
 *               type: string
 *         schema:
 *           $ref: '#/definitions/BusAttendance'
 */
router.get('/me', async (ctx: Context) => {
  const user: User = ctx.state.user
  const attendance = await BusAttendance.getUserResponseForToday(user)
  ctx.body = {
    attendance: attendance ? attendance : null
  }
})

/**
 * @swagger
 * /bus/attendance/me/status:
 *   get:
 *     description: Returns the Attendance linked to current user
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: 'Value must be of format: Bearer token_comes_here'
 *         required: true
 *         schema:
 *           type: string
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Success Response
 *         headers:
 *           X-Refresh-Token:
 *             description: New extended token
 *             schema:
 *               type: string
 *         schema:
 *           type: object
 *           properties:
 *              attendance:
 *                type: string
 *                enum: [attending, notAttending, pending]
 */
router.get('/me/status', async (ctx: Context) => {
  const user: User = ctx.state.user

  ctx.body = {
    attendance: getUserStatusText(user)
  }
})
