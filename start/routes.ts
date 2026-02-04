/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const HealthController = () => import('#controllers/health_controller')
const AuthController = () => import('#controllers/auth_controller')

router.get('/', async () => {
  return {
    status: 'success',
    message: 'Welcome to the BCC Freepass Backend API',
  }
})

router.group(() => {
  router.get('/health', [HealthController, 'index'])

  router.group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
  }).prefix('/auth')

  router.group(() => {
    router.post('/logout', [AuthController, 'logout'])
    router.get('/me', [AuthController, 'me'])
  }).prefix('/auth').use(middleware.auth())

}).prefix('/api')
