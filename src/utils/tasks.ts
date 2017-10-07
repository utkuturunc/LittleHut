import * as moment from 'moment'
import { scheduleJob } from 'node-schedule'
import { Events } from '../models'
import { avatarCache } from '../singletons/avatarCache'
import { events } from '../singletons/events'
import { getAvatars } from './attendance'
import { getBusStatus, getRemainingTimeToBus } from './busStatus'

export const remainingTimeToBus = scheduleJob('*/30 * * * * *', () => {
  events.publish(Events.remainingTimeToBus, getRemainingTimeToBus(moment()))
})

export const currentBusStatus = scheduleJob('*/45 * * * * *', () => {
  events.publish(Events.busStatus, getBusStatus())
})

export const resetBusStatus = scheduleJob('1 0 0 * * *', () => {
  events.publish(Events.busStatus, getBusStatus())
})

export const resetAvatarCache = scheduleJob('1 0 0 * * *', async () => {
  avatarCache.clear()
  getAvatars()
})
