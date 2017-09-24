import { Context } from 'koa'
import * as KoaRouter from 'koa-router'
import { groupBy, includes, mapKeys } from 'lodash'
import * as moment from 'moment'
import { slackClient } from '../../clients'
import { Slack, User } from '../../entities'
import { BusAttendance } from '../../entities/BusAttendance'
import { Attendee } from '../../models/misc'
import { subscription } from '../../helpers/subscription'

export const router = new KoaRouter({
  prefix: '/attendance'
})

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

const statusFilter = (list: string[]) => (user: Attendee) => includes(list, user.id)
const pendingFilter = (nonPendingList: string[]) => (user: Attendee) => !includes(nonPendingList, user.id)

interface AvatarData {
  slackUserID: string
  slackTeamID: string
  avatar: string
}

const getAttendance = async () => {
  const attendance = await BusAttendance.todaysAttendance()
  const statuses = mapKeys(
    groupBy(attendance, 'isAttending'),
    (value, key) => (key.toString() === 'true' ? 'attending' : 'notAttending')
  )
  const usersFromSlack = await slackClient.getAllActiveUsers()
  const avatars = usersFromSlack.map<AvatarData>(user => ({
    slackUserID: user.id,
    slackTeamID: user.team_id,
    avatar: user.profile.image_192
  }))

  const slackData = await Slack.list()

  const activeUsers = await User.getActiveUsers()

  const users = slackData.map<Attendee>(slack => {
    const user = activeUsers.find(userData => userData.id === slack.userID)
    if (!user) throw new Error('One to one relation must always find a user')
    const avatarData = avatars.find(
      avatarDataElement =>
        avatarDataElement.slackTeamID === slack.slackTeamID && avatarDataElement.slackUserID === slack.slackUserID
    )
    if (!user.id) throw new Error('User was not initialized')
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: avatarData ? avatarData.avatar : null
    }
  })

  const attendingIDs = statuses.attending ? statuses.attending.map(element => element.userID) : []
  const notAttendingIDs = statuses.notAttending ? statuses.notAttending.map(element => element.userID) : []
  const attending = users.filter(statusFilter(attendingIDs))
  const notAttending = users.filter(statusFilter(notAttendingIDs))
  const pending = users.filter(pendingFilter([...attendingIDs, ...notAttendingIDs]))
  return {
    attending,
    notAttending,
    pending
  }
}

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
  const attendance = await BusAttendance.getUserResponseForToday(user)
  const today = moment()

  if (!ctx.request.body) throw new Error('Validation error')
  const isAttending = ctx.request.body.isAttending

  if (!attendance) {
    if (!user.id) throw new Error('Unexpected error')
    const newAttendance = await BusAttendance.create({ userID: user.id, isAttending, date: today })
    subscription.publish('userStatusUpdated', await getAttendance())
    ctx.body = newAttendance
    return
  } else {
    const newAttendance = await BusAttendance.update({ ...attendance, isAttending })
    subscription.publish('userStatusUpdated', await getAttendance())
    ctx.body = newAttendance
    return
  }
})

router.get('/status', async (ctx: Context) => {
  const user: User = ctx.state.user
  const attendance = await BusAttendance.getUserResponseForToday(user)
  ctx.body = {
    attendance: attendance ? attendance : null
  }
})

router.get('/me', async (ctx: Context) => {
  const user: User = ctx.state.user
  const attendance = await BusAttendance.getUserResponseForToday(user)

  if (!attendance) {
    ctx.body = {
      attendance: 'pending'
    }
    return
  }

  ctx.body = {
    attendance: attendance.isAttending ? 'attending' : 'notAttending'
  }
})
