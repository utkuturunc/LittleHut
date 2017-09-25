import { groupBy, includes, mapKeys } from 'lodash'
import { slackClient } from '../clients'
import { Slack, User } from '../entities'
import { BusAttendance } from '../entities/BusAttendance'
import { Attendee } from '../models/misc'

const statusFilter = (list: string[]) => (user: Attendee) => includes(list, user.id)
const pendingFilter = (nonPendingList: string[]) => (user: Attendee) => !includes(nonPendingList, user.id)

interface AvatarData {
  slackUserID: string
  slackTeamID: string
  avatar: string
}

export const getAttendance = async () => {
  const attendance = await BusAttendance.todaysAttendance()
  const statuses = mapKeys(
    groupBy(attendance, 'isAttending'),
    (value, key) => (key.toString() === 'true' ? 'attending' : 'notAttending')
  )
  const usersFromSlack = await slackClient.getAllActiveUsers()
  const avatars = usersFromSlack.map<AvatarData>(user => ({
    slackUserID: user.id,
    slackTeamID: user.team_id,
    avatar: user.profile.image_192
  }))

  const slackData = await Slack.list()

  const activeUsers = await User.getActiveUsers()

  const users = slackData.map<Attendee>(slack => {
    const user = activeUsers.find(userData => userData.id === slack.userID)
    if (!user) throw new Error('One to one relation must always find a user')
    const avatarData = avatars.find(
      avatarDataElement =>
        avatarDataElement.slackTeamID === slack.slackTeamID && avatarDataElement.slackUserID === slack.slackUserID
    )
    if (!user.id) throw new Error('User was not initialized')
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: avatarData ? avatarData.avatar : null
    }
  })

  const attendingIDs = statuses.attending ? statuses.attending.map(element => element.userID) : []
  const notAttendingIDs = statuses.notAttending ? statuses.notAttending.map(element => element.userID) : []
  const attending = users.filter(statusFilter(attendingIDs))
  const notAttending = users.filter(statusFilter(notAttendingIDs))
  const pending = users.filter(pendingFilter([...attendingIDs, ...notAttendingIDs]))
  return {
    attending,
    notAttending,
    pending
  }
}
