import { errors } from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'

export function handleHttpError(error: any, response: HttpContext['response']) {
  if (error instanceof errors.E_VALIDATION_ERROR) {
    return response.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: error.messages,
    })
  }

  if (error.code === 'E_ROW_NOT_FOUND' || error.code === '22P02') {
    return response.status(404).json({
      status: 'error',
      message: 'Resource not found',
    })
  }

  const errorMap: Record<string, [number, string]> = {
    EMAIL_EXISTS: [409, 'Email already exists'],
    CANNOT_UPDATE_USER_ROLE: [
      403,
      'Cannot update user with role "user". Only owners can be updated.',
    ],
    CANNOT_DELETE_ADMIN: [403, 'Cannot delete admin user'],
    TABLE_NUMBER_EXISTS: [409, 'Table number already exists'],
    BARCODE_EXISTS: [409, 'Barcode value already exists'],
    OWNER_ALREADY_HAS_CANTEEN: [400, 'Owner already has a canteen. Only one canteen is allowed per owner.'],
  }

  if (errorMap[error.message]) {
    const [status, message] = errorMap[error.message]
    return response.status(status).json({ status: 'error', message })
  }

  console.error('Unexpected error:', error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
}
