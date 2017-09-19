import { Context } from 'koa'
import * as KoaRouter from 'koa-router'
import { config } from '../../config/index'
import { passport } from '../../helpers/authentication'
import { ok } from '../../helpers/response/success'
import { authenticate } from '../../middleware/authentication'

export const router = new KoaRouter()

router.post('/', authenticate('local'))
