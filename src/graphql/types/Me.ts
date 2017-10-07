import { GraphQLContext } from '../../helpers/types'
import { getUserStatusText } from '../../utils/attendance'
import MeStatus from './MeStatus'

const MeType = `
  type Me {
    status: MeStatus
  }
`

export const resolvers = {
  status: (object: never, args: never, { user }: GraphQLContext) => getUserStatusText(user)
}
export default () => [MeType, MeStatus]
