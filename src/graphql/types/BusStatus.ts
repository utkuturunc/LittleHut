const BusStatusType = `
  enum BusStatus {
    waitingForBus
    busHasArrived
    busHasDeparted
    bonAppetit
    busIsWaiting
    checkTomorrow
    busIsReturning
    nonWorkingDay
    checkLater
  }
`

export const resolvers = {}
export default () => [BusStatusType]
