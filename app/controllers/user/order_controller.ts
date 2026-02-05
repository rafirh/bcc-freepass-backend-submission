import type { HttpContext } from '@adonisjs/core/http'
import { OrderService } from '#services/order_service'
import { getUserOrdersQueryValidator } from '#validators/user_validator'
import { createOrderValidator } from '#validators/order_validator'
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

  async store({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const data = await request.validateUsing(createOrderValidator)

      const result = await this.orderService.createOrder(user.id, data)

      return response.status(201).json({
        status: 'success',
        message: 'Order created successfully',
        data: {
          order: result.order,
          payment: {
            url: result.payment_url,
            token: result.payment_token,
          },
        },
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async show({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const orderId = params.id

      const order = await this.orderService.getOrderDetailByUserId(user.id, orderId)

      return response.status(200).json({
        status: 'success',
        data: order,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }
}
