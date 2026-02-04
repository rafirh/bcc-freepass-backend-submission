import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(
    { auth, response }: HttpContext,
    next: NextFn,
    options: {
      roles?: string[]
    } = {}
  ) {
    const user = auth.getUserOrFail()

    const allowedRoles = options.roles || []

    if (!allowedRoles.includes(user.role)) {
      return response.status(403).json({
        status: 'error',
        message: 'Forbidden: You do not have permission to access this resource',
      })
    }

    return next()
  }
}
