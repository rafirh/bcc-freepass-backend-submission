import type { HttpContext } from '@adonisjs/core/http'
import { AuthService } from '#services/auth_service'
import { registerValidator, loginValidator, changePasswordValidator } from '#validators/auth_validator'
import { handleHttpError } from '#helpers/http_error'

export default class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)

      const user = await this.authService.register(payload)

      return response.status(201).json({
        status: 'success',
        message: 'Registration successful',
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.fullName,
          phone_number: user.phoneNumber,
          is_active: user.isActive,
          is_verified: user.isVerified,
          created_at: user.createdAt.toISO(),
        },
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(loginValidator)

      const authData = await this.authService.login(payload)

      return response.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: authData,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const token = auth.user?.currentAccessToken

      if (token) {
        await this.authService.logout(user, token.identifier)
      }

      return response.status(200).json({
        status: 'success',
        message: 'Logout successful',
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async changePassword({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(changePasswordValidator)

      await this.authService.changePassword(user, payload.old_password, payload.new_password)

      return response.status(200).json({
        status: 'success',
        message: 'Password changed successfully',
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }
}
