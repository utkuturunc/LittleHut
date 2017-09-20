import * as KoaRouter from 'koa-router'
import { isAuthenticated } from '../middleware/authentication'
import { router as auth } from './auth'
import { router as bus } from './bus'
import { router as root } from './root'
import { router as users } from './users'

export const router = new KoaRouter()

router.use('', root.routes())
router.use('/auth', auth.routes())
router.use('/users', isAuthenticated, users.routes())
router.use('/bus', isAuthenticated, bus.routes())
