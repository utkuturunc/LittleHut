import { unauthorized } from 'boom'
import { sign } from 'jsonwebtoken'
import { Context } from 'koa'
import * as KoaRouter from 'koa-router'
import * as qs from 'qs'
import { config } from '../../config/index'
import { User } from '../../entities'
import { passport } from '../../helpers/authentication'
import { createJWT, verifyJWT } from '../../helpers/authentication/jwt'
import { ok } from '../../helpers/response/success'
import { checkAuthentication } from '../../middleware/authentication'

export const router = new KoaRouter()

router.get('/', async ctx => {
  const clientID = config.get('slack.clientID')
  const token = await createJWT(
    {
      url: ctx.query.url,
      client_id: clientID,
      type: 'login'
    },
    { expiresIn: '15m' }
  )
  const params = qs.stringify({
    client_id: clientID,
    scope: config.get('slack.scope'),
    redirect_uri: `${config.get('domain')}/api/auth/slack/callback`,
    state: token
  })
  return ctx.redirect(`https://slack.com/oauth/authorize?${params}`)
})
router.get('/callback', checkAuthentication('slack'), async ctx => {
  const payload = await verifyJWT(ctx.query.state)
  const user = ctx.state.user
  const token = await user.generateJWT('authentication')
  if (payload.url) return ctx.redirect(`${payload.url}?token=${token}`)
  ctx.body = {
    token,
    user
  }
})
