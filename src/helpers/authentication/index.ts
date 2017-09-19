// import { JWTStrategy } from './jwt'
import * as passportLibrary from 'koa-passport'
import { User } from '../../entities'
import { jwtStrategy } from './jwt'
import { localStrategy } from './local'
import { microsoftStrategy } from './microsoft'
import { slackStrategy } from './slack'

passportLibrary.serializeUser((user, done) => {
  return done(null, user.id)
})

passportLibrary.deserializeUser((id, done) => {
  return User.findByID(id)
    .then(user => done(null, user))
    .catch(err => done(err, null))
})

passportLibrary.use(localStrategy)
passportLibrary.use(jwtStrategy)
passportLibrary.use('slack', slackStrategy)
passportLibrary.use('microsoft', microsoftStrategy)

export const passport = passportLibrary
