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
      message: 'Data not found',
    })
  }

  const errorMap: Record<string, [number, string]> = {
    EMAIL_EXISTS: [409, 'Email already exists'],
    INVALID_CREDENTIALS: [401, 'Invalid email or password'],
    ACCOUNT_DISABLED: [403, 'Account is disabled'],
    INVALID_OLD_PASSWORD: [401, 'Invalid old password'],
    CANNOT_UPDATE_USER_ROLE: [
      403,
      'Cannot update user with role "user". Only owners can be updated.',
    ],
    CANNOT_DELETE_ADMIN: [403, 'Cannot delete admin user'],
    TABLE_NUMBER_EXISTS: [409, 'Table number already exists'],
    BARCODE_EXISTS: [409, 'Barcode value already exists'],
    OWNER_ALREADY_HAS_CANTEEN: [
      400,
      'Owner already has a canteen. Only one canteen is allowed per owner.',
    ],
    ORDER_EMPTY: [400, 'Order must contain at least one item'],
    MENU_NOT_FOUND: [404, 'One or more menu items not found'],
    MENU_DIFFERENT_CANTEEN: [400, 'All menu items must be from the same canteen'],
    MENU_NOT_ACTIVE: [400, 'Menu item is not active'],
    MENU_OUT_OF_STOCK: [400, 'Menu item is out of stock'],
    MENU_INSUFFICIENT_STOCK: [400, 'Insufficient stock for menu item'],
    ORDER_NOT_PAID: [400, 'Cannot review an order that has not been paid'],
    REVIEW_ALREADY_EXISTS: [400, 'You have already reviewed this order'],
    PAYMENT_NOT_FOUND: [404, 'Payment record not found for this order'],
    TABLE_NOT_FOUND: [404, 'Table not found'],
    INVALID_STATUS_TRANSITION: [400, 'Invalid order status transition'],
    ORDER_MUST_BE_PAID_BEFORE_COOKING: [400, 'Order must be paid before cooking'],
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
