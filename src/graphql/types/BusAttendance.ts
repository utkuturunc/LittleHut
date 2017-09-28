import { BusAttendance, User } from '../../entities'
import UserType from './User'

const BusAttendanceType = `
  type BusAttendance {
    user: User!
    date: String!
    isAttending: Boolean!
  }
`
export const resolvers = {
  user: (attendance: BusAttendance) => User.findByID(attendance.userID)
}
export default () => [BusAttendanceType, UserType]
