import User from '#models/user'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import { unlink } from 'node:fs/promises'
import path from 'node:path'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

export interface UpdateProfileData {
  full_name?: string
  phone_number?: string | null
  avatar?: MultipartFile
}

export interface UserResponse {
  id: string
  email: string
  role: string
  full_name: string
  phone_number: string | null
  avatar_url: string | null
  is_active: boolean
  is_verified: boolean
  created_at?: string | null
  updated_at?: string | null
}

export interface UserProfileResponse {
  id: string
  email: string
  full_name: string
  phone_number: string | null
  avatar_url: string | null
}

export class UserService {
  async getUserProfile(user: User): Promise<UserProfileResponse> {
    return {
      id: user.id,
      email: user.email,
      full_name: user.fullName,
      phone_number: user.phoneNumber,
      avatar_url: user.avatarUrl,
    }
  }

  async updateProfile(user: User, data: UpdateProfileData): Promise<UserProfileResponse> {
    if (data.full_name) {
      user.fullName = data.full_name
    }

    if (data.phone_number !== undefined) {
      user.phoneNumber = data.phone_number
    }

    if (data.avatar) {
      await this.handleAvatarUpload(user, data.avatar)
    }

    await user.save()

    return {
      id: user.id,
      email: user.email,
      full_name: user.fullName,
      phone_number: user.phoneNumber,
      avatar_url: user.avatarUrl
    }
  }

  private async handleAvatarUpload(user: User, avatar: MultipartFile): Promise<void> {
    if (user.avatarUrl) {
      await this.deleteOldAvatar(user.avatarUrl)
    }

    const avatarName = `${cuid()}.${avatar.extname}`
    await avatar.move(app.makePath('uploads/avatars'), {
      name: avatarName,
    })

    user.avatarUrl = `/uploads/avatars/${avatarName}`
  }

  private async deleteOldAvatar(avatarUrl: string): Promise<void> {
    try {
      const oldAvatarPath = app.makePath('uploads/avatars', path.basename(avatarUrl))
      await unlink(oldAvatarPath)
    } catch (error) {
      console.error('Error deleting old avatar:', error)
    }
  }
}
