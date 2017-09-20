import { config } from './config'
import { SlackClient } from './models'

export const slackClient = new SlackClient({ token: config.get('slack.accessToken') })
