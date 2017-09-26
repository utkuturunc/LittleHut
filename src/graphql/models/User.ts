import Attendance from './Attendance'

const User = `
  type User {
    name: String!
    email: String!
    attendance: Attendance
  }
`
export default () => [User, Attendance]
