import AttendeeType from './Attendee'

const AttendeeStatusType = `
  type AttendeeStatus {
    attending: [Attendee]
    notAttending: [Attendee]
    pending: [Attendee]
  }
`

export const resolvers = {}
export default () => [AttendeeStatusType, AttendeeType]
