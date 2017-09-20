import * as KoaRouter from 'koa-router'
import { passport } from '../../helpers/authentication'
import { authenticate } from '../../middleware/authentication'

export const router = new KoaRouter()

router.get('/', passport.authenticate('microsoft'))
router.get('/callback', authenticate('microsoft'))
