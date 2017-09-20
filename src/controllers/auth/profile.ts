import * as KoaRouter from 'koa-router'
import { checkAuthentication } from '../../middleware/authentication'

export const router = new KoaRouter()

router.get('/', checkAuthentication('jwt'), ctx => {
  ctx.body = ctx.state.user
})
