import * as KoaRouter from 'koa-router'
import { authenticate } from '../../middleware/authentication'

export const router = new KoaRouter()

router.post('/', authenticate('local'))
