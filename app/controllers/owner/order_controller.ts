import type { HttpContext } from '@adonisjs/core/http'
import { OrderService } from '#services/order_service'
import { updateOrderStatusValidator } from '#validators/order_validator'
import { handleHttpError } from '#helpers/http_error'

export default class OrderController {
  private orderService: OrderService

  constructor() {
    this.orderService = new OrderService()
  }

  async index({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const status = request.input('status')

      const result = await this.orderService.getOrdersByOwnerId(user.id, page, limit, status)

      return response.status(200).json({
        status: 'success',
        data: result.orders,
        meta: result.meta,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async show({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const order = await this.orderService.getOrderDetail(user.id, params.id)

      return response.status(200).json({
        status: 'success',
        data: order,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async updateStatus({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(updateOrderStatusValidator)
      const order = await this.orderService.updateOrderStatus(user.id, params.id, payload)

      return response.status(200).json({
        status: 'success',
        message: 'Order status updated successfully',
        data: order,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }
}
