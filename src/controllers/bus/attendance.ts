import { Context } from 'koa'
import * as KoaRouter from 'koa-router'
import { groupBy, includes, mapKeys } from 'lodash'
import * as moment from 'moment'
import { User } from '../../entities'
import { BusAttendance } from '../../entities/BusAttendance'

export const router = new KoaRouter()

router.get('/attendance', async (ctx: Context) => {
  const attendance = await BusAttendance.todaysAttendance()
  const statuses = mapKeys(groupBy(attendance), key => (key ? 'attending' : 'notAttending'))
  console.log(JSON.stringify)
  const users = await User.query()
  const attending = users.filter(user =>
    includes(statuses.attending ? statuses.attending.map(element => element.userID) : [], user.id)
  )
  const notAttending = users.filter(user =>
    includes(statuses.notAttending ? statuses.notAttending.map(element => element.userID) : [], user.id)
  )

  ctx.body = {
    attending,
    notAttending
  }
  // ctx.body = mapKeys(groupBy(list), key => (key ? 'attending' : 'notAttending'))
})

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
