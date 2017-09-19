import * as KoaRouter from 'koa-router'
import { router as local } from './local'
import { router as microsoft } from './microsoft'
import { router as slack } from './slack'

export const router = new KoaRouter()

router.use('', local.routes())
router.use('/slack', slack.routes())
router.use('/microsoft', microsoft.routes())
