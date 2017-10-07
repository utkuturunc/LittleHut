import * as moment from 'moment'
import { getBusStatus, getRemainingTimeToBus } from '../../utils/busStatus'
import BusStatus from './BusStatus'
import Time from './Time'

const BusType = `
  type Bus {
    status: BusStatus
    remainingTime: Time
  }
`

export const resolvers = {
  status: () => getBusStatus(),
  remainingTime: () => getRemainingTimeToBus(moment())
}
export default () => [BusType, BusStatus, Time]
