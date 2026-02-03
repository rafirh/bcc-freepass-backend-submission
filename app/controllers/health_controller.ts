import { HttpContext } from '@adonisjs/core/http'

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Check API health status
 *     description: Returns the current health status of the API
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-02-03T20:40:00.000Z
 *                 service:
 *                   type: string
 *                   example: BCC Canteen API
 */
export default class HealthController {
  async index({ response }: HttpContext) {
    return response.ok({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'BCC Canteen API',
    })
  }
}
