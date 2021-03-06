import { groupBy, includes, mapKeys } from 'lodash'
import { Moment } from 'moment'
import * as moment from 'moment'
import { slackClient } from '../clients'
import { Slack, User } from '../entities'
import { BusAttendance } from '../entities/BusAttendance'
import { Events } from '../models'
import { Attendee } from '../models/misc'
import { avatarCache } from '../singletons/avatarCache'
import { events } from '../singletons/events'

const statusFilter = (list: string[]) => (user: Attendee) => includes(list, user.id)
const pendingFilter = (nonPendingList: string[]) => (user: Attendee) => !includes(nonPendingList, user.id)

export interface AvatarData {
  slackUserID: string
  slackTeamID: string
  avatar: string
}

export const getAvatars = async () => {
  const avatarsFromCache = avatarCache.get()
  if (avatarsFromCache) return avatarsFromCache
  const usersFromSlack = await slackClient.getAllActiveUsers()
  const avatars = usersFromSlack.map<AvatarData>(user => ({
    slackUserID: user.id,
    slackTeamID: user.team_id,
    avatar: user.profile.image_192
  }))
  avatarCache.set(avatars)
  return avatars
}

const getAttendees = async () => {
  const [avatars, slackData, activeUsers] = await Promise.all([getAvatars(), Slack.list(), User.getActiveUsers()])

  return slackData.map<Attendee>(slack => {
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
}

interface Statuses {
  attending: BusAttendance[]
  notAttending: BusAttendance[]
}

export interface AttendeeStatuses {
  pending: Attendee[]
  notAttending: Attendee[]
  attending: Attendee[]
}

export const getAttendance = async (): Promise<AttendeeStatuses> => {
  const [users, attendance] = await Promise.all([getAttendees(), BusAttendance.todaysAttendance()])
  const statuses: Statuses = mapKeys(
    groupBy(attendance, 'isAttending'),
    (value, key) => (key.toString() === 'true' ? 'attending' : 'notAttending')
  ) as any
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

export const getUserStatusText = async (user: User) => {
  const attendance = await BusAttendance.getUserResponseForToday(user)
  if (!attendance) return 'pending'
  return attendance.isAttending ? 'attending' : 'notAttending'
}

export const setBusAttendance = async (user: User, isAttending: boolean, date: Moment = moment()) => {
  const attendance = await BusAttendance.getUserResponseForToday(user)
  if (!attendance) {
    if (!user.id) throw new Error('Unexpected error')
    const newAttendance = await BusAttendance.create({ userID: user.id, isAttending, date })
    events.publish(Events.userStatusUpdated, getAttendance())
    return newAttendance
  } else {
    const newAttendance = await BusAttendance.update({ ...attendance, isAttending })
    events.publish(Events.userStatusUpdated, getAttendance())
    return newAttendance
  }
}
