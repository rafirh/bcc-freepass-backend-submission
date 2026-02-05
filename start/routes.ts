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
const CanteenController = () => import('#controllers/canteen_controller')
const TableController = () => import('#controllers/table_controller')
const AdminUserController = () => import('#controllers/admin/user_controller')
const AdminTableController = () => import('#controllers/admin/table_controller')
const OwnerCanteenController = () => import('#controllers/owner/canteen_controller')
const OwnerMenuController = () => import('#controllers/owner/menu_controller')
const OwnerOrderController = () => import('#controllers/owner/order_controller')
const OwnerReviewController = () => import('#controllers/owner/review_controller')
const UserOrderController = () => import('#controllers/user/order_controller')
const UserReviewController = () => import('#controllers/user/review_controller')
const MidtransWebhookController = () => import('#controllers/midtrans_webhook_controller')

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

  router.get('/canteens', [CanteenController, 'index'])
  router.get('/canteens/:id', [CanteenController, 'show'])
  router.get('/canteens/:canteenId/menus', [CanteenController, 'getMenus'])

  router.get('/tables', [TableController, 'index'])

  router.group(() => {
    router.post('/webhooks/midtrans', [MidtransWebhookController, 'handle'])
  })

  router.group(() => {
    router.get('/orders', [UserOrderController, 'index'])
    router.post('/orders', [UserOrderController, 'store'])
    router.get('/orders/:id', [UserOrderController, 'show'])
    router.post('/reviews', [UserReviewController, 'store'])
  }).prefix('/user').use([middleware.auth(), middleware.role({ roles: ['user'] })])

  router.group(() => {
    router.resource('users', AdminUserController).apiOnly()
    router.resource('tables', AdminTableController).apiOnly()
  }).prefix('/admin').use([middleware.auth(), middleware.role({ roles: ['admin'] })])

  router.group(() => {
    router.get('/canteen', [OwnerCanteenController, 'show'])
    router.post('/canteen', [OwnerCanteenController, 'store'])
    router.put('/canteen', [OwnerCanteenController, 'update'])

    router.get('/menus', [OwnerMenuController, 'index'])
    router.post('/menus', [OwnerMenuController, 'store'])
    router.put('/menus/:id', [OwnerMenuController, 'update'])
    router.delete('/menus/:id', [OwnerMenuController, 'destroy'])

    router.get('/orders', [OwnerOrderController, 'index'])
    router.get('/orders/:id', [OwnerOrderController, 'show'])
    router.patch('/orders/:id/status', [OwnerOrderController, 'updateStatus'])

    router.get('/reviews', [OwnerReviewController, 'index'])
    router.delete('/reviews/:id', [OwnerReviewController, 'destroy'])
  }).prefix('/owner').use([middleware.auth(), middleware.role({ roles: ['owner'] })])
}).prefix('/api')
