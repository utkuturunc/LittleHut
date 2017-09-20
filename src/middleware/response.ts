import { Middleware } from 'koa'
import { includes } from 'lodash'

export const responseInterceptor: Middleware = async (ctx, next) => {
  await next()
  if (!includes(ctx.response.get('Content-Type'), 'application/json')) return
  if (ctx.status >= 400 && ctx.status <= 599) {
    ctx.body = {
      status: false,
      result: JSON.parse(ctx.body)
    }
    return
  }
  ctx.body = {
    status: true,
    result: JSON.parse(ctx.body)
  }
}
