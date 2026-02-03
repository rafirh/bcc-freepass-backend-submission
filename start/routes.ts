/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

const HealthController = () => import('#controllers/health_controller')

/**
 * Swagger Documentation Routes
 */
router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Health Check
 *     summary: API Health Check
 *     description: Returns a simple hello world message to verify the API is running
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hello:
 *                   type: string
 *                   example: world
 */
router.get('/', async () => {
  return {
    hello: 'world',
  }
})

/**
 * API Routes
 */
router.group(() => {
  router.get('/health', [HealthController, 'index'])
}).prefix('/api')
