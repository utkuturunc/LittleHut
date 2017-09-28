import * as moment from 'moment'
import { getBusStatus, getRemainingTimeToBus } from '../../utils/busStatus'

const BusType = `

  enum Status {
    waitingForBus
    busHasArrived
    busHasDeparted
    bonAppetit
    busIsWaiting
    checkTomorrow
    busIsReturning
    nonWorkingDay
    checkLater
  }

  type RemainingTime {
    hours: Int!
    minutes: Int!
  }

  type Bus {
    status: Status
    remainingTime: RemainingTime
  }
`

export const resolvers = {
  status: () => getBusStatus(),
  remainingTime: () => getRemainingTimeToBus(moment())
}
export default () => [BusType]
