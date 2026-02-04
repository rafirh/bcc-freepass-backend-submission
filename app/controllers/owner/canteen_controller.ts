import type { HttpContext } from '@adonisjs/core/http'
import { CanteenService } from '#services/canteen_service'
import { createCanteenValidator, updateCanteenValidator } from '#validators/canteen_validator'
import { handleHttpError } from '#helpers/http_error'

export default class CanteenController {
  private canteenService: CanteenService

  constructor() {
    this.canteenService = new CanteenService()
  }

  async show({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const canteen = await this.canteenService.getCanteenByOwnerId(user.id)

      if (!canteen) {
        return response.status(404).json({
          status: 'error',
          message: 'Owner does not have a canteen',
        })
      }

      return response.status(200).json({
        status: 'success',
        data: canteen,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async store({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(createCanteenValidator)
      const canteen = await this.canteenService.createCanteen(user.id, payload)

      return response.status(201).json({
        status: 'success',
        message: 'Canteen created successfully',
        data: canteen,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async update({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(updateCanteenValidator)
      const canteen = await this.canteenService.updateCanteen(user.id, payload)

      return response.status(200).json({
        status: 'success',
        message: 'Canteen updated successfully',
        data: canteen,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }
}
