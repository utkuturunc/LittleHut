import { Context } from 'koa'
import * as KoaRouter from 'koa-router'
import { isAuthenticated } from '../../middleware/authentication'
import { getBusStatus } from '../../utils/busStatus'

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
router.get('/', isAuthenticated, async (ctx: Context) => {
  ctx.body = {
    status: getBusStatus()
  }
})
