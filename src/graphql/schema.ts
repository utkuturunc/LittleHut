import { makeExecutableSchema } from 'graphql-tools'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import { BusAttendance as AttendanceModel, User as UserModel } from './../entities'
import User from './models/User'

const Query = `
  type Query {
    users: [User]
    user(id: String!): User
  }
`
const SchemaDefinition = `
  schema {
    query: Query
  }
`

const resolvers: IResolvers = {
  Query: {
    users: () => UserModel.list(),
    user: (_, { id }) => UserModel.findByID(id)
  },
  // Mutation: {},
  User: {
    attendance: (user: UserModel) => AttendanceModel.getUserResponseForToday(user)
  },
  Attendance: {
    user: (attendance: AttendanceModel) => UserModel.query().findById(attendance.userID)
  }
}

export const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, Query, User],
  resolvers
})
