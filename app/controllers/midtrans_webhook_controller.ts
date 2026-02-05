import type { HttpContext } from '@adonisjs/core/http'
import { OrderService } from '#services/order_service'
import { handleHttpError } from '#helpers/http_error'
import midtransConfig from '#config/midtrans'
import crypto from 'node:crypto'

export default class MidtransWebhookController {
  private orderService: OrderService

  constructor() {
    this.orderService = new OrderService()
  }

  async handle({ request, response }: HttpContext) {
    try {
      const notification = request.body()

      const {
        order_id,
        status_code,
        gross_amount,
        signature_key: receivedSignature,
      } = notification

      const serverKey = midtransConfig.serverKey
      const signatureString = `${order_id}${status_code}${gross_amount}${serverKey}`
      const expectedSignature = crypto.createHash('sha512').update(signatureString).digest('hex')

      if (receivedSignature !== expectedSignature) {
        return response.status(403).json({
          status: 'error',
          message: 'Invalid signature',
        })
      }

      const result = await this.orderService.handleMidtransWebhook(notification)

      return response.status(200).json({
        status: 'success',
        message: 'Webhook processed successfully',
        data: result,
      })
    } catch (error) {
      console.error('Midtrans webhook error:', error)
      return handleHttpError(error, response)
    }
  }
}
