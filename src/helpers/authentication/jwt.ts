import { sign, SignOptions, verify } from 'jsonwebtoken'
import { Strategy as JWTStrategy } from 'passport-jwt'
import { config } from '../../config'
import { User } from '../../entities'

const cookieExtractor = (ctx: any) => {
  if (ctx.cookies.get('_jwt')) {
    return ctx.cookies.get('_jwt')
  } else {
    return ctx.header.authorization.replace('Bearer ', '')
  }
}

const jwtOptions = {
  jwtFromRequest: cookieExtractor as any,
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

export const createJWT = (payload: any, options?: SignOptions) =>
  new Promise((resolve, reject) => {
    const newOptions = options ? options : {}
    sign(
      payload,
      config.get('jwt.secret'),
      {
        issuer: config.get('jwt.issuer'),
        audience: config.get('jwt.audience'),
        ...newOptions
      },
      (err, token) => {
        if (err) return reject(err)
        return resolve(token)
      }
    )
  })

export const verifyJWT = (jwt: string): any =>
  new Promise((resolve, reject) => {
    verify(
      jwt,
      config.get('jwt.secret'),
      {
        issuer: config.get('jwt.issuer'),
        audience: config.get('jwt.audience')
      },
      (err, payload) => {
        if (err) return reject(err)
        return resolve(payload)
      }
    )
  })
