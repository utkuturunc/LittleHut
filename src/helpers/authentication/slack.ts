import axios from 'axios'
import { Strategy as OAuth2Strategy } from 'passport-oauth2'
import { config } from '../../config'
import { Slack, User } from '../../entities'

OAuth2Strategy.prototype.userProfile = (accessToken: string, done: (err: any, user?: any) => any) => {
  return axios
    .get('https://slack.com/api/users.identity', {
      params: {
        token: accessToken
      }
    })
    .then(result => done(null, result.data))
    .catch(done)
}

export const slackStrategy = new OAuth2Strategy(
  {
    authorizationURL: 'https://slack.com/oauth/authorize',
    tokenURL: 'https://slack.com/api/oauth.access',
    clientID: config.get('slack.clientID'),
    clientSecret: config.get('slack.clientSecret'),
    callbackURL: `${config.get('domain')}/api/auth/slack/callback`,
    scope: config.get('slack.scope'),
    scopeSeperator: ','
  },
  (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, result?: { message: string }) => any
  ) => {
    if (!profile.ok) {
      return done({ error: 'Slack error' })
    }
    return User.associateSlack(
      { name: profile.user.name, email: profile.user.email },
      { slackTeamID: profile.team.id, slackUserID: profile.user.id, accessToken, refreshToken }
    )
      .then(user => done(null, user))
      .catch(done)
  }
)
