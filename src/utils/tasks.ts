import * as moment from 'moment'
import { scheduleJob } from 'node-schedule'
import { subscription } from '../singletons/subscription'
import { getBusStatus, getRemainingTimeToBus } from './busStatus'

export const remainingTimeToBus = scheduleJob('*/30 * * * * *', () => {
  subscription.publish('remainingTimeToBus', getRemainingTimeToBus(moment().utcOffset(3)))
})

export const currentBusStatus = scheduleJob('*/45 * * * * *', () => {
  subscription.publish('busStatus', getBusStatus())
})

export const resetBusStatus = scheduleJob('1 0 0 * * *', () => {
  subscription.publish('busStatus', getBusStatus())
})
