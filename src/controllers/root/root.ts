import { Context } from 'koa'
import * as KoaRouter from 'koa-router'
import { config } from '../../config/index'
import { ok } from '../../helpers/response/success'
import { isAuthenticated } from '../../middleware/authentication'
import { SSE } from '../../models/SSE'
import { events } from '../../singletons/events'

export const router = new KoaRouter()

/**
 * @swagger
 * /build:
 *   get:
 *     description: Returns the server config
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Success Response
 *         schema:
 *           type: object
 */
router.get('/build', async (ctx: Context) => {
  const { NODE_ENV } = process.env
  try {
    ctx.body = {
      build: config.get('build'),
      environment: {
        NODE_ENV
      }
    }
  } catch (error) {
    ctx.body = {
      build: config.get('build'),
      environment: {
        NODE_ENV
      }
    }
  }
})

/**
 * @swagger
 * /health:
 *   get:
 *     description: Health endpoint
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Success Response
 *         schema:
 *           type: object
 *           properties:
 *              message:
 *                type: string
 *                enum: [ok, error]
 */
router.get('/health', (ctx: Context) => {
  ctx.body = ok()
})

/**
 * @swagger
 * /database:
 *   get:
 *     description: Logs database credentials to the console (Development mode only)
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Success Response
 *         schema:
 *           type: object
 *           properties:
 *              message:
 *                type: string
 *                enum: [ok]
 */
router.post('/database', (ctx: Context) => {
  console.log({ DATABASE: config.get('database') })
  ctx.body = ok()
})

/**
 * @swagger
 * /subscribe:
 *   get:
 *     description: Subscription url for broadcasted events
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: 'Value must be of format: Bearer token_comes_here'
 *         required: true
 *         schema:
 *           type: string
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns an EventSource
 *         headers:
 *           X-Refresh-Token:
 *             description: New extended token
 *             schema:
 *               type: string
 */
router.get('/subscribe', isAuthenticated, async ctx => {
  ctx.compress = false
  ctx.req.setTimeout(Number.MAX_VALUE, () => undefined)
  ctx.type = 'text/event-stream; charset=utf-8'
  ctx.set('Cache-Control', 'no-cache')
  ctx.set('Connection', 'keep-alive')

  const subscription = events.getSubscription()

  const body = new SSE()

  const close = () => {
    subscription.unpipe(body)
    socket.removeListener('error', close)
    socket.removeListener('close', close)
  }

  subscription.pipe(body)
  ctx.body = body

  const socket = ctx.socket
  socket.on('error', close)
  socket.on('close', close)
})
