import { makeExecutableSchema } from 'graphql-tools'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import { getAttendance } from '../utils/attendance'
import { User } from './../entities'
import { resolvers as AttendeeResolver } from './types/Attendee'
import { resolvers as AttendeeStatusResolver } from './types/AttendeeStatus'
import AttendeeStatusType from './types/AttendeeStatus'
import { resolvers as BusResolver } from './types/Bus'
import BusType from './types/Bus'
import { resolvers as BusAttendanceResolver } from './types/BusAttendance'
import { resolvers as UserResolver } from './types/User'
import UserType from './types/User'

const Query = `
  type Query {
    users: [User]
    user(id: String!): User
    attendance: AttendeeStatus
    bus: Bus
  }
`
const SchemaDefinition = `
  schema {
    query: Query
  }
`

const resolvers: IResolvers = {
  Query: {
    users: () => User.list(),
    user: (_, { id }) => User.findByID(id),
    attendance: () => getAttendance(),
    bus: () => ({})
  },
  // Mutation: {},
  User: UserResolver,
  BusAttendance: BusAttendanceResolver,
  AttendeeStatus: AttendeeStatusResolver,
  Attendee: AttendeeResolver,
  Bus: BusResolver
}

export const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, Query, UserType, AttendeeStatusType, BusType],
  resolvers
})
