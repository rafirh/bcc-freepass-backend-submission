import type { HttpContext } from '@adonisjs/core/http'
import { updateProfileValidator } from '#validators/user_validator'
import { errors } from '@vinejs/vine'
import { UserService } from '#services/user_service'

export default class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const userData = await this.userService.getUserProfile(user)

      return response.status(200).json({
        status: 'success',
        data: userData,
      })
    } catch (error) {
      console.error('Get user error:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      })
    }
  }

  async updateProfile({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(updateProfileValidator)

      const updatedUser = await this.userService.updateProfile(user, {
        full_name: payload.full_name,
        phone_number: payload.phone_number,
        avatar: payload.avatar,
      })

      return response.status(200).json({
        status: 'success',
        message: 'Profile updated successfully',
        data: updatedUser,
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.messages,
        })
      }

      console.error('Update profile error:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      })
    }
  }
}
