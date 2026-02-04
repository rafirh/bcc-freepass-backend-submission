import User from '#models/user'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import { unlink } from 'node:fs/promises'
import path from 'node:path'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import hash from '@adonisjs/core/services/hash'

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

export interface CreateOwnerData {
  email: string
  password: string
  full_name: string
  phone_number?: string | null
  is_active?: boolean
  is_verified?: boolean
}

export interface UpdateOwnerData {
  email?: string
  password?: string
  full_name?: string
  phone_number?: string | null
  is_active?: boolean
  is_verified?: boolean
  avatar?: MultipartFile
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
    await avatar.move(app.makePath('public/uploads/avatars'), {
      name: avatarName,
    })

    user.avatarUrl = `/uploads/avatars/${avatarName}`
  }

  private async deleteOldAvatar(avatarUrl: string): Promise<void> {
    try {
      const oldAvatarPath = app.makePath('public/uploads/avatars', path.basename(avatarUrl))
      await unlink(oldAvatarPath)
    } catch (error) {
      console.error('Error deleting old avatar:', error)
    }
  }

  async getAllUsersAndOwners(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    users: UserResponse[]
    meta: { total: number; page: number; limit: number; totalPages: number }
  }> {
    const users = await User.query()
      .whereIn('role', ['user', 'owner'])
      .paginate(page, limit)

    return {
      users: users.all().map((user) => this.formatUserResponse(user)),
      meta: {
        total: users.total,
        page: users.currentPage,
        limit: users.perPage,
        totalPages: users.lastPage,
      },
    }
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = await User.findOrFail(id)
    return this.formatUserResponse(user)
  }

  async createOwner(data: CreateOwnerData): Promise<UserResponse> {
    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      throw new Error('EMAIL_EXISTS')
    }

    const passwordHash = await hash.make(data.password)

    const user = await User.create({
      email: data.email,
      passwordHash,
      role: 'owner',
      fullName: data.full_name,
      phoneNumber: data.phone_number || null,
      isActive: data.is_active ?? true,
      isVerified: data.is_verified ?? false,
    })

    return this.formatUserResponse(user)
  }

  async updateOwner(id: string, data: UpdateOwnerData): Promise<UserResponse> {
    const user = await User.findOrFail(id)

    if (user.role !== 'owner') {
      throw new Error('CANNOT_UPDATE_USER_ROLE')
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await User.findBy('email', data.email)
      if (existingUser) {
        throw new Error('EMAIL_EXISTS')
      }
      user.email = data.email
    }

    if (data.password) {
      user.passwordHash = await hash.make(data.password)
    }

    if (data.full_name) {
      user.fullName = data.full_name
    }

    if (data.phone_number !== undefined) {
      user.phoneNumber = data.phone_number
    }

    if (data.is_active !== undefined) {
      user.isActive = data.is_active
    }

    if (data.is_verified !== undefined) {
      user.isVerified = data.is_verified
    }

    if (data.avatar) {
      await this.handleAvatarUpload(user, data.avatar)
    }

    await user.save()
    return this.formatUserResponse(user)
  }

  async deleteUserOrOwner(id: string): Promise<void> {
    const user = await User.findOrFail(id)

    if (user.role === 'admin') {
      throw new Error('CANNOT_DELETE_ADMIN')
    }

    if (user.avatarUrl) {
      await this.deleteOldAvatar(user.avatarUrl)
    }

    await user.delete()
  }

  private formatUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.fullName,
      phone_number: user.phoneNumber,
      avatar_url: user.avatarUrl,
      is_active: user.isActive,
      is_verified: user.isVerified,
      created_at: user.createdAt.toISO(),
      updated_at: user.updatedAt.toISO(),
    }
  }
}
