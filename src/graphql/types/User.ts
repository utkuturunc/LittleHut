import { BusAttendance, User } from '../../entities'
import BusAttendanceType from './BusAttendance'

const UserType = `
  type User {
    name: String!
    email: String!
    busAttendance: BusAttendance
  }
`

export const resolvers = {
  busAttendance: (user: User) => BusAttendance.getUserResponseForToday(user)
}

export default () => [UserType, BusAttendanceType]
