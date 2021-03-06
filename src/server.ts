import { methodNotAllowed, notImplemented } from 'boom'
import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import * as cors from 'kcors'
import * as Koa from 'koa'
import * as KoaBetterBody from 'koa-better-body'
import * as compress from 'koa-compress'
import * as convert from 'koa-convert'
import * as etag from 'koa-etag'
import * as helmet from 'koa-helmet'
import * as mount from 'koa-mount'
import * as session from 'koa-session'
import * as serve from 'koa-static'
import * as qs from 'qs'
import 'source-map-support'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { config } from './config'
import { Model } from './config/database'
import { schema } from './graphql/schema'
import { passport } from './helpers/authentication'
import { errorHandler } from './middleware/error'
import { router } from './router'
import './utils/tasks'

const sessionConfig = {
  key: config.get('session.key'),
  maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false
}

const app = new Koa()
app.keys = [config.get('session.secret')]
app
  .use(errorHandler)
  .use(
    helmet({
      noSniff: false,
      frameguard: false
    })
  )
  .use(convert(cors()))
  .use(etag())
  .use(compress())
  .use(session(sessionConfig, app))
  .use(
    convert(
      KoaBetterBody({
        fields: 'body',
        jsonLimit: '1mb',
        querystring: qs
      })
    )
  )
  .use(passport.initialize())
  .use(passport.session())
  .use(mount('/public', serve(__dirname + '/public')))
  .use(router.routes())
  .use(
    router.allowedMethods({
      throw: true,
      notImplemented: () => notImplemented(),
      methodNotAllowed: () => methodNotAllowed()
    })
  )

const server = createServer(app.callback()).listen(config.get('port'), async () => {
  // console.log(router.stack)

  // tslint:disable
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema
    },
    {
      server,
      path: '/api/subscriptions'
    }
  )
  // tslint:enable

  await Model.knex().migrate.latest()

  console.log('listening')
  console.log(config.get('database'))
})
