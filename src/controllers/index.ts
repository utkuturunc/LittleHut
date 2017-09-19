import * as KoaRouter from 'koa-router'
import { router as auth } from './auth'
import { router as root } from './root'

export const router = new KoaRouter()

router.use('', root.routes())
router.use('/auth', auth.routes())
