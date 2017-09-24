import { Context } from 'koa'
import * as KoaRouter from 'koa-router'
import { config } from '../../config/index'
import { ok } from '../../helpers/response/success'
import { subscription } from '../../helpers/subscription'
import { checkAuthentication } from '../../middleware/authentication'
import { SSE } from '../../models/SSE'

export const router = new KoaRouter()

router.get('/build', async (ctx: Context) => {
  const { NODE_ENV } = process.env
  try {
    ctx.body = {
      build: config.get('build'),
      environment: {
        NODE_ENV
      }
    }
  } catch (error) {
    ctx.body = {
      build: config.get('build'),
      environment: {
        NODE_ENV
      }
    }
  }
})

router.get('/health', (ctx: Context) => {
  ctx.body = ok()
})

router.post('/database', checkAuthentication('jwt'), (ctx: Context) => {
  console.log({ DATABASE: config.get('database') })
  ctx.body = ok()
})

router.get('/subscribe', async ctx => {
  ctx.compress = false
  ctx.req.setTimeout(Number.MAX_VALUE, () => undefined)
  ctx.type = 'text/event-stream; charset=utf-8'
  ctx.set('Cache-Control', 'no-cache')
  ctx.set('Connection', 'keep-alive')

  const body = new SSE()

  const close = () => {
    subscription.unpipe(body)
    socket.removeListener('error', close)
    socket.removeListener('close', close)
  }

  subscription.pipe(body)
  ctx.body = body

  const socket = ctx.socket
  socket.on('error', close)
  socket.on('close', close)
})
