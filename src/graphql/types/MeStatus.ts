const MeStatusType = `
  enum MeStatus {
    attending
    notAttending
    pending
  }
`

export const resolvers = {}
export default () => [MeStatusType]
