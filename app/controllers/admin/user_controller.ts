import type { HttpContext } from '@adonisjs/core/http'
import { UserService } from '#services/user_service'
import { createOwnerValidator, updateOwnerValidator } from '#validators/user_validator'
import { handleHttpError } from '#helpers/http_error'

export default class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const result = await this.userService.getAllUsersAndOwners(page, limit)

      return response.status(200).json({
        status: 'success',
        data: result.users,
        meta: result.meta,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const user = await this.userService.getUserById(params.id)

      return response.status(200).json({
        status: 'success',
        data: user,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createOwnerValidator)
      const user = await this.userService.createOwner(payload)

      return response.status(201).json({
        status: 'success',
        message: 'Owner created successfully',
        data: user,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateOwnerValidator)
      const user = await this.userService.updateOwner(params.id, payload)

      return response.status(200).json({
        status: 'success',
        message: 'Owner updated successfully',
        data: user,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      await this.userService.deleteUserOrOwner(params.id)

      return response.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }
}
