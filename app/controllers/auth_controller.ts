import type { HttpContext } from '@adonisjs/core/http'
import { AuthService } from '#services/auth_service'
import { registerValidator, loginValidator } from '#validators/auth_validator'
import { errors } from '@vinejs/vine'

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
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.messages,
        })
      }

      if (error.message === 'EMAIL_EXISTS') {
        return response.status(409).json({
          status: 'error',
          message: 'Email already registered',
        })
      }

      console.error('Registration error:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      })
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
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(400).json({
          status: 'error',
          message: 'Missing email or password',
        })
      }

      if (error.message === 'INVALID_CREDENTIALS') {
        return response.status(401).json({
          status: 'error',
          message: 'Invalid email or password',
        })
      }

      if (error.message === 'ACCOUNT_DISABLED') {
        return response.status(403).json({
          status: 'error',
          message: 'Account is disabled',
        })
      }

      console.error('Login error:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      })
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
      console.error('Logout error:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      })
    }
  }
}
