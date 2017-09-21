import { BoomError } from 'boom'
import { Context, Middleware } from 'koa'
import { config } from '../config'
import { unexpected } from '../helpers/response/failure'

const handleBoomError = (error: BoomError) => ({
  status: error.output.statusCode,
  body: (error as any).data
    ? {
        ...error.output.payload,
        data: (error as any).data
      }
    : error.output.payload,
  stack: config.get('env') === 'development' ? error.stack : undefined
})

export const errorHandler: Middleware = async (ctx: Context, next: Function) => {
  try {
    await next()
  } catch (error) {
    console.error(error)
    const environment = config.get('env')
    if (error.isBoom) {
      const boomError: BoomError = error
      const output = handleBoomError(boomError)
      if (environment === 'development') console.error(output.stack)
      ctx.status = output.status
      ctx.body = output.body
    } else {
      if (environment === 'development') {
        ctx.status = 500
        ctx.body = {
          error: error.message,
          stack: error.stack
        }
      } else {
        const boomError: BoomError = unexpected()
        const output = handleBoomError(boomError)
        if (environment === 'development') console.error(output.stack)
        ctx.status = output.status
        ctx.body = output.body
      }
    }
  }
}
