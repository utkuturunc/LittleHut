import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'
import { config } from '../../config'
import { User } from '../../entities'

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('jwt.secret'),
  issuer: config.get('jwt.issuer'),
  audience: config.get('jwt.audience')
}

export const jwtStrategy = new JWTStrategy(jwtOptions, (payload, done) => {
  if (payload.type !== 'authentication') return done({ message: 'Invalid token' })
  return User.findByID(payload.id)
    .then(user => {
      if (user) return done(null, user)
      return done(null, false, { message: 'No user found' })
    })
    .catch(err => done(err))
})
