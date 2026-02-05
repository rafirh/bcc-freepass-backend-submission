import type { HttpContext } from '@adonisjs/core/http'
import { OrderService } from '#services/order_service'
import { getUserOrdersQueryValidator } from '#validators/user_validator'
import { handleHttpError } from '#helpers/http_error'

export default class OrderController {
  private orderService: OrderService

  constructor() {
    this.orderService = new OrderService()
  }

  async index({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const { page = 1, limit = 10, status } = await request.validateUsing(
        getUserOrdersQueryValidator
      )

      const result = await this.orderService.getOrdersByUserId(user.id, page, limit, status)

      return response.status(200).json({
        status: 'success',
        data: result.orders,
        meta: result.meta,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }
}
