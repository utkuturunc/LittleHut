import * as moment from 'moment'
import { Moment } from 'moment'
import { config } from '../config'
const BUS_OFFICE_DEPARTURE_HOUR = config.get('bus.office.departure.hour')
const BUS_OFFICE_DEPARTUE_MINUTE = config.get('bus.office.departure.minute')
const BUS_LITTLE_HUT_DEPARTUE_HOUR = config.get('bus.littleHut.departure.hour')
const BUS_LITTLE_HUT_DEPARTUE_MINUTE = config.get('bus.littleHut.departure.minute')
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
  waitingForBus: '03:00',
  busHasArrived: '08:45',
  busHasDeparted: '08:50',
  bonAppetit: '09:00',
  waitingForBusFromLittleHut: '09:20',
  busIsWaiting: '09:45',
  busIsReturning: '09:50',
  checkTomorrow: '10:00',
  endOfDay: '20:59'
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
  else if (breakPoints.bonAppetit <= nowTime && nowTime < breakPoints.waitingForBusFromLittleHut) {
    return 'bonAppetit'
  } else if (breakPoints.waitingForBusFromLittleHut <= nowTime && nowTime < breakPoints.busIsWaiting) {
    return 'waitingForBus'
  } else if (breakPoints.busIsWaiting <= nowTime && nowTime < breakPoints.busIsReturning) {
    return 'busIsWaiting'
  } else if (breakPoints.busIsReturning <= nowTime && nowTime < breakPoints.checkTomorrow) return 'busIsReturning'
  else if (breakPoints.checkTomorrow <= nowTime && nowTime < breakPoints.endOfDay) return 'checkTomorrow'
  else return 'checkLater'
}

const getNextBusTime = (time: Moment) => {
  const todayBusOfficeDepartureTime = time
    .clone()
    .hours(BUS_OFFICE_DEPARTURE_HOUR)
    .minutes(BUS_OFFICE_DEPARTUE_MINUTE)
  const todayBusLittleHutDepartureTime = time
    .clone()
    .hours(BUS_LITTLE_HUT_DEPARTUE_HOUR)
    .minutes(BUS_LITTLE_HUT_DEPARTUE_MINUTE)
  const tomorrowBusOfficeDepartureTime = time
    .clone()
    .add(1, 'day')
    .hours(BUS_OFFICE_DEPARTURE_HOUR)
    .minutes(BUS_OFFICE_DEPARTUE_MINUTE)

  const timeToDeparture = () => time.isBefore(todayBusOfficeDepartureTime)
  const timeToWayBack = () => time.isBetween(todayBusOfficeDepartureTime, todayBusLittleHutDepartureTime)
  const timeToTomorrowDeparture = () =>
    time.isBetween(todayBusLittleHutDepartureTime, tomorrowBusOfficeDepartureTime)

  if (timeToTomorrowDeparture()) return tomorrowBusOfficeDepartureTime
  else if (timeToWayBack()) return todayBusLittleHutDepartureTime
  else if (timeToDeparture()) return todayBusOfficeDepartureTime
  else throw new Error('Invalid date')
}

export const getRemainingTimeToBus = (time: Moment) => {
  const comparisonTime = getNextBusTime(time)
  const minutes = comparisonTime.diff(time, 'minutes')
  const hours = comparisonTime.diff(time, 'hours')
  return {
    hours,
    minutes: minutes % 60
  }
}
