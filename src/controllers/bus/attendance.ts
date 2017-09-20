import { Context } from 'koa'
import * as KoaRouter from 'koa-router'
import { groupBy, includes, mapKeys } from 'lodash'
import * as moment from 'moment'
import { User } from '../../entities'
import { BusAttendance } from '../../entities/BusAttendance'

export const router = new KoaRouter()

/**
 * @swagger
 * /bus/attendance:
 *   get:
 *     description: Returns the attendance lists
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

const statusFilter = (list: string[]) => (user: User) => includes(list, user.id)
const pendingFilter = (nonPendingList: string[]) => (user: User) => !includes(nonPendingList, user.id)

router.get('/attendance', async (ctx: Context) => {
  const attendance = await BusAttendance.todaysAttendance()
  const statuses = mapKeys(groupBy(attendance), key => (key ? 'attending' : 'notAttending'))
  const users = await User.list()

  const attendingIDs = statuses.attending ? statuses.attending.map(element => element.userID) : []
  const notAttendingIDs = statuses.notAttending ? statuses.notAttending.map(element => element.userID) : []

  const attending = users.filter(statusFilter(attendingIDs))
  const notAttending = users.filter(statusFilter(notAttendingIDs))
  const pending = users.filter(pendingFilter([...attendingIDs, ...notAttendingIDs]))

  ctx.body = {
    attending,
    notAttending,
    pending
  }
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
router.post('/attendance', async (ctx: Context) => {
  const user: User = ctx.state.user
  const attendance = await BusAttendance.getUserResponseForToday(user)
  const today = moment()

  if (!ctx.request.body) throw new Error('Validation error')
  const isAttending = ctx.request.body.isAttending

  if (!attendance) {
    if (!user.id) throw new Error('Unexpected error')
    ctx.body = await BusAttendance.create({ userID: user.id, isAttending, date: today })
    return
  } else {
    ctx.body = await BusAttendance.update({ ...attendance, isAttending })
    return
  }
})
