import { unauthorized } from 'boom'
import { Middleware } from 'koa'
import { User } from '../entities'
import { passport } from '../helpers/authentication'

export const authenticate: (strategy: string) => Middleware = strategy => (ctx, next) => {
  return passport.authenticate(strategy, (err: any, user?: User | boolean, info?: any, status?: any) => {
    if (err) {
      throw unauthorized((err && err.message) || (info && info.message))
    } else {
      if (user === true) throw new Error('User cannot be true')
      if (user) {
        return user.generateJWT('authentication').then(token => {
          ctx.body = {
            token,
            user
          }
          ctx.cookies.set('_jwt', token)
        })
      }
      throw unauthorized(info && info.message)
    }
  })(ctx, next)
}

export const checkAuthentication: (strategy: string) => Middleware = strategy => (ctx, next) => {
  return passport.authenticate(strategy, (err: any, user?: User | boolean, info?: any, status?: any) => {
    if (err) {
      throw unauthorized((err && err.message) || (info && info.message))
    } else {
      if (user === true) throw new Error('User cannot be true')
      if (user) {
        ctx.state.user = user
        return user.generateJWT('authentication').then(token => {
          ctx.set('X-Refresh-Token', token)
          ctx.cookies.set('_jwt', token)
          return next()
        })
      }
      throw unauthorized(info && info.message)
    }
  })(ctx, next)
}

export const isAuthenticated = checkAuthentication('jwt')
