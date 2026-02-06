import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export interface RegisterData {
  email: string
  password: string
  full_name: string
  phone_number?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    role: string
    full_name: string
    is_active: boolean
    is_verified: boolean
  }
  token: string
  expires_in: number
}

export class AuthService {
  async register(data: RegisterData): Promise<User> {
    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      throw new Error('EMAIL_EXISTS')
    }

    const user = await User.create({
      email: data.email,
      passwordHash: data.password,
      fullName: data.full_name,
      phoneNumber: data.phone_number || null,
      role: 'user',
      isActive: true,
      isVerified: true,
    })

    return user
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const user = await User.findBy('email', data.email)
    if (!user) {
      throw new Error('INVALID_CREDENTIALS')
    }

    if (!user.isActive) {
      throw new Error('ACCOUNT_DISABLED')
    }

    const isPasswordValid = await hash.verify(user.passwordHash, data.password)
    if (!isPasswordValid) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const token = await User.accessTokens.create(user, ['*'], {
      expiresIn: '24 hours',
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.fullName,
        is_active: user.isActive,
        is_verified: user.isVerified,
      },
      token: token.value!.release(),
      expires_in: 86400, // 24 hours in seconds
    }
  }

  async logout(user: User, tokenId: string | number | BigInt): Promise<void> {
    await User.accessTokens.delete(user, tokenId)
  }

  async changePassword(user: User, oldPassword: string, newPassword: string): Promise<void> {
    const isOldPasswordValid = await hash.verify(user.passwordHash, oldPassword)
    if (!isOldPasswordValid) {
      throw new Error('INVALID_OLD_PASSWORD')
    }

    user.passwordHash = newPassword
    await user.save()
  }
}
