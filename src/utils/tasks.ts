import * as moment from 'moment'
import { scheduleJob } from 'node-schedule'
import { config } from '../config'
import { subscription } from '../singletons/subscription'
import { getBusStatus } from './busStatus'

const BUS_DEPARTUE_HOUR = config.get('bus.departure.hour')
const BUS_DEPARTUE_MINUTE = config.get('bus.departure.minute')

export const remainingTimeToBus = scheduleJob('*/30 * * * * *', () => {
  const now = moment()
  const todayBusTime = moment()
    .hours(BUS_DEPARTUE_HOUR)
    .minutes(BUS_DEPARTUE_MINUTE)
  const tomorrowBusTime = moment()
    .add(1, 'day')
    .hours(BUS_DEPARTUE_HOUR)
    .minutes(BUS_DEPARTUE_MINUTE)

  const busHasPassed = todayBusTime.isBefore(now)

  const minutes = busHasPassed ? tomorrowBusTime.diff(now, 'minutes') : todayBusTime.diff(now, 'minutes')

  const difference = {
    hours: busHasPassed ? tomorrowBusTime.diff(now, 'hours') : todayBusTime.diff(now, 'hours'),
    minutes: minutes % 60
  }

  subscription.publish('remainingTimeToBus', difference)
})

export const currentBusStatus = scheduleJob('*/45 * * * * *', () => {
  subscription.publish('busStatus', getBusStatus())
})
