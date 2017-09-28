import * as moment from 'moment'
import { scheduleJob } from 'node-schedule'
import { avatarCache } from '../singletons/avatarCache'
import { subscription } from '../singletons/subscription'
import { getAvatars } from './attendance'
import { getBusStatus, getRemainingTimeToBus } from './busStatus'

export const remainingTimeToBus = scheduleJob('*/30 * * * * *', () => {
  subscription.publish('remainingTimeToBus', getRemainingTimeToBus(moment()))
})

export const currentBusStatus = scheduleJob('*/45 * * * * *', () => {
  subscription.publish('busStatus', getBusStatus())
})

export const resetBusStatus = scheduleJob('1 0 0 * * *', () => {
  subscription.publish('busStatus', getBusStatus())
})

export const resetAvatarCache = scheduleJob('1 0 0 * * *', async () => {
  avatarCache.clear()
  getAvatars()
})
