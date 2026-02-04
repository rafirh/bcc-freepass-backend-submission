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
const UserController = () => import('#controllers/user_controller')
const AdminUserController = () => import('#controllers/admin/user_controller')

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
    router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
  }).prefix('/auth')

  router.group(() => {
    router.get('/me', [UserController, 'me'])
    router.put('/profile', [UserController, 'updateProfile'])
  }).prefix('/users').use(middleware.auth())

  router
    .group(() => {
      router.resource('users', AdminUserController).apiOnly()
    })
    .prefix('/admin')
    .use([middleware.auth(), middleware.role({ roles: ['admin'] })])
}).prefix('/api')
