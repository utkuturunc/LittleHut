import { Context } from 'koa'
import * as KoaRouter from 'koa-router'
import { slackClient } from '../../clients'
import { config } from '../../config/index'
import { passport } from '../../helpers/authentication'
import { ok } from '../../helpers/response/success'
import { checkAuthentication } from '../../middleware/authentication'

export const router = new KoaRouter()

router.get('/', async (ctx: Context) => {
  const users = await slackClient.getUserList()
  ctx.body = users
})
