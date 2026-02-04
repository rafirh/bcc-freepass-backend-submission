import type { HttpContext } from '@adonisjs/core/http'
import { updateProfileValidator } from '#validators/user_validator'
import { errors } from '@vinejs/vine'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import { unlink } from 'node:fs/promises'
import path from 'node:path'

export default class UserController {
  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      return response.status(200).json({
        status: 'success',
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.fullName,
          phone_number: user.phoneNumber,
          avatar_url: user.avatarUrl,
          is_active: user.isActive,
          is_verified: user.isVerified,
          created_at: user.createdAt.toISO(),
        },
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

      if (payload.full_name) {
        user.fullName = payload.full_name
      }

      if (payload.phone_number !== undefined) {
        user.phoneNumber = payload.phone_number
      }

      if (payload.avatar) {
        if (user.avatarUrl) {
          try {
            const oldAvatarPath = app.makePath('uploads/avatars', path.basename(user.avatarUrl))
            await unlink(oldAvatarPath)
          } catch (error) {
            console.error('Error deleting old avatar:', error)
          }
        }

        const avatarName = `${cuid()}.${payload.avatar.extname}`
        await payload.avatar.move(app.makePath('uploads/avatars'), {
          name: avatarName,
        })

        user.avatarUrl = `/uploads/avatars/${avatarName}`
      }

      await user.save()

      return response.status(200).json({
        status: 'success',
        message: 'Profile updated successfully',
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.fullName,
          phone_number: user.phoneNumber,
          avatar_url: user.avatarUrl,
          is_active: user.isActive,
          is_verified: user.isVerified,
          updated_at: user.updatedAt.toISO(),
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

      console.error('Update profile error:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      })
    }
  }
}
