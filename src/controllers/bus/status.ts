import { Context } from 'koa'
import * as KoaRouter from 'koa-router'
import { getBusStatus, getRemainingTimeToBus } from '../../utils/busStatus'

export const router = new KoaRouter()

/**
 * @swagger
 * /bus/status:
 *   get:
 *     description: Returns the Attendance linked to current user
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
 *         description: Success Response
 *         headers:
 *           X-Refresh-Token:
 *             description: New extended token
 *             schema:
 *               type: string
 *         schema:
 *           type: object
 *           properties:
 *              status:
 *                type: string
 *                enum: [waitingForBus, busHasArrived, busHasDeparted, bonAppetit, busIsWaiting,
 *                       checkTomorrow, busIsReturning, nonWorkingDay, checkLater]
 */
router.get('/', async (ctx: Context) => {
  ctx.body = {
    status: getBusStatus()
  }
})

/**
 * @swagger
 * /bus/status/remaining:
 *   get:
 *     description: Returns the Attendance linked to current user
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
 *         description: Success Response
 *         headers:
 *           X-Refresh-Token:
 *             description: New extended token
 *             schema:
 *               type: string
 *         schema:
 *           type: object
 *           properties:
 *             hours:
 *               type: integer
 *             minutes:
 *               type: integer
 */
router.get('/remaining', async (ctx: Context) => {
  ctx.body = getRemainingTimeToBus()
})
