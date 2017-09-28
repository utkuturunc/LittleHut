import UserType from './User'

const AttendeeType = `
  type Attendee {
    id: String!
    name: String!
    email: String!
    avatar: String
  }
`

export const resolvers = {}
export default () => [AttendeeType, UserType]
