import { Context } from 'koa'
import * as KoaRouter from 'koa-router'
import { config } from '../../config/index'
import { User } from '../../entities'
import { passport } from '../../helpers/authentication'
import { ok } from '../../helpers/response/success'
import { authenticate, checkAuthentication } from '../../middleware/authentication'

export const router = new KoaRouter()

router.get('/', checkAuthentication('jwt'), ctx => {
  ctx.body = ctx.state.user
})
