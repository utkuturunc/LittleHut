import { Context } from 'koa'
import * as KoaRouter from 'koa-router'
import { slackClient } from '../../clients'

export const router = new KoaRouter()

router.get('/', async (ctx: Context) => {
  const users = await slackClient.getAllUsers()
  ctx.body = users
})
