import * as KoaRouter from 'koa-router'
import { isAuthenticated } from '../../middleware/authentication'

export const router = new KoaRouter()

router.get('/', isAuthenticated, ctx => {
  ctx.body = ctx.state.user
})
