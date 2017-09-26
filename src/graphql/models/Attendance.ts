import User from './User'

const Attendance = `
  type Attendance {
    user: User!
    date: String!
    isAttending: Boolean!
  }
`
export default () => [Attendance, User]
