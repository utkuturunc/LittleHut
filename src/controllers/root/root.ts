import { Context } from 'koa'
import * as KoaRouter from 'koa-router'
import { config } from '../../config/index'
import { passport } from '../../helpers/authentication'
import { ok } from '../../helpers/response/success'
import { checkAuthentication } from '../../middleware/authentication'

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
