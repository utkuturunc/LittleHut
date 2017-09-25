import * as KoaRouter from 'koa-router'
import { router as attendance } from './attendance'
import { router as status } from './status'

export const router = new KoaRouter()

router.use('/attendance', attendance.routes())
router.use('/status', status.routes())
