import User from './User'

const BusAttendance = `
  type BusAttendance {
    attending: [User]
    notAttending: [User]
    pending: [User]
  }
`
export default () => [BusAttendance, User]
