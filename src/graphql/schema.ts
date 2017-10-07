import { makeExecutableSchema } from 'graphql-tools'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import { Events } from '../models'
import { events } from '../singletons/events'
import { getAttendance, setBusAttendance } from '../utils/attendance'
import { User } from './../entities'
import { resolvers as AttendeeResolver } from './types/Attendee'
import { resolvers as AttendeeStatusResolver } from './types/AttendeeStatus'
import AttendeeStatusType from './types/AttendeeStatus'
import BusType from './types/Bus'
import { resolvers as BusResolver } from './types/Bus'
import { resolvers as BusAttendanceResolver } from './types/BusAttendance'
import BusAttendanceType from './types/BusAttendance'
import BusStatusType from './types/BusStatus'
import { resolvers as MeResolver } from './types/Me'
import MeType from './types/Me'
import TimeType from './types/Time'
import { resolvers as UserResolver } from './types/User'
import UserType from './types/User'

const Query = `
  type Query {
    users: [User]
    user(id: String!): User
    attendance: AttendeeStatus
    bus: Bus
    me: Me
  }
`

const Mutation = `
  type Mutation {
    changeBusStatus(
      isAttending: Boolean!
    ): BusAttendance!
  }
`

const Subscription = `
  type Subscription {
    busStatus: BusStatus
    remainingTimeToBus: Time
    userStatusUpdated: AttendeeStatus
  }
`

const SchemaDefinition = `
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`

const resolvers: IResolvers = {
  Query: {
    users: () => User.list(),
    user: (_, { id }) => User.findByID(id),
    attendance: () => getAttendance(),
    bus: () => ({}),
    me: () => ({})
  },
  Mutation: {
    changeBusStatus: (object, { isAttending }, { user }) => setBusAttendance(user, isAttending)
  },
  Subscription: {
    busStatus: {
      subscribe: () => events.getAsyncIterator(Events.busStatus)
    },
    remainingTimeToBus: {
      subscribe: () => events.getAsyncIterator(Events.remainingTimeToBus)
    },
    userStatusUpdated: {
      subscribe: () => events.getAsyncIterator(Events.userStatusUpdated)
    }
  },
  User: UserResolver,
  BusAttendance: BusAttendanceResolver,
  AttendeeStatus: AttendeeStatusResolver,
  Attendee: AttendeeResolver,
  Bus: BusResolver,
  Me: MeResolver
}

export const schema = makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    Query,
    Mutation,
    Subscription,
    UserType,
    TimeType,
    BusStatusType,
    AttendeeStatusType,
    BusType,
    BusAttendanceType,
    MeType
  ],
  resolvers
})
