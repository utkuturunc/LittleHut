import * as moment from 'moment'
import { config } from '../config/index'
const BUS_DEPARTUE_HOUR = config.get('bus.departure.hour')
const BUS_DEPARTUE_MINUTE = config.get('bus.departure.minute')
export type BusStatus =
  | 'waitingForBus'
  | 'busHasArrived'
  | 'busHasDeparted'
  | 'bonAppetit'
  | 'busIsWaiting'
  | 'checkTomorrow'
  | 'busIsReturning'
  | 'nonWorkingDay'
  | 'checkLater'

export const breakPoints = {
  waitingForBus: '06:00',
  busHasArrived: '11:45',
  busHasDeparted: '11:50',
  bonAppetit: '12:20',
  busIsWaiting: '12:45',
  busIsReturning: '12:50',
  checkTomorrow: '13:00',
  endOfDay: '23:59'
}

export const getBusStatus = (): BusStatus => {
  const now = moment()
  const nowDay = now.day()
  const nowTime = now.format('HH:mm')

  if (
    nowDay === 0 ||
    nowDay === 6 ||
    (nowDay === 5 && breakPoints.checkTomorrow <= nowTime && nowTime <= breakPoints.endOfDay)
  ) {
    return 'nonWorkingDay'
  }

  if (breakPoints.waitingForBus <= nowTime && nowTime < breakPoints.busHasArrived) return 'waitingForBus'
  else if (breakPoints.busHasArrived <= nowTime && nowTime < breakPoints.busHasDeparted) return 'busHasArrived'
  else if (breakPoints.busHasDeparted <= nowTime && nowTime < breakPoints.bonAppetit) return 'busHasDeparted'
  else if (breakPoints.bonAppetit <= nowTime && nowTime < breakPoints.busIsWaiting) return 'bonAppetit'
  else if (breakPoints.busIsWaiting <= nowTime && nowTime < breakPoints.busIsReturning) return 'busIsWaiting'
  else if (breakPoints.busIsReturning <= nowTime && nowTime < breakPoints.checkTomorrow) return 'busIsReturning'
  else if (breakPoints.checkTomorrow <= nowTime && nowTime < breakPoints.endOfDay) return 'checkTomorrow'
  else return 'checkLater'
}

export const getRemainingTimeToBus = () => {
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

  return {
    hours: busHasPassed ? tomorrowBusTime.diff(now, 'hours') : todayBusTime.diff(now, 'hours'),
    minutes: minutes % 60
  }
}
