import axios from 'axios'
import * as jwt from 'jsonwebtoken'
import { Strategy as MicrosoftStrategy } from 'passport-azure-ad-oauth2'
import { config } from '../../config'
import { Slack, User } from '../../entities'

export const microsoftStrategy = new MicrosoftStrategy(
  {
    clientID: config.get('microsoft.clientID'),
    clientSecret: config.get('microsoft.clientSecret'),
    callbackURL: 'http://localhost:2000/api/auth/microsoft/callback',
    tenant: 'common',
    resource: 'https://graph.windows.net'
  },
  (
    accessToken: string,
    refreshToken: string,
    params: any,
    profile: any,
    done: (error: any, user?: any, result?: { message: string }) => any
  ) => {
    const resolvedProfile = jwt.decode(params.id_token) as any
    if (!params || !params.id_token || !resolvedProfile) {
      return done({ error: 'Microsoft error' })
    }
    return User.associateMicrosoft(
      { name: resolvedProfile.name, email: resolvedProfile.unique_name },
      { objectID: resolvedProfile.oid, tenantID: resolvedProfile.tid, accessToken, refreshToken }
    )
      .then(user => done(null, user))
      .catch(done)
  }
)
