import vine from '@vinejs/vine'

export const updateProfileValidator = vine.compile(
  vine.object({
    full_name: vine.string().trim().minLength(2).maxLength(150).optional(),
    phone_number: vine.string().trim().regex(/^08\d{8,11}$/).optional().nullable(),
    avatar: vine.file({
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif'],
    }).optional(),
  })
)

export const createOwnerValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string().minLength(8).maxLength(255),
    full_name: vine.string().trim().minLength(2).maxLength(150),
    phone_number: vine.string().trim().regex(/^08\d{8,11}$/).optional().nullable(),
    is_active: vine.boolean().optional(),
    is_verified: vine.boolean().optional(),
  })
)

export const updateOwnerValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail().optional(),
    password: vine.string().minLength(8).maxLength(255).optional(),
    full_name: vine.string().trim().minLength(2).maxLength(150).optional(),
    phone_number: vine.string().trim().regex(/^08\d{8,11}$/).optional().nullable(),
    is_active: vine.boolean().optional(),
    is_verified: vine.boolean().optional(),
    avatar: vine.file({ size: '2mb', extnames: ['jpg', 'jpeg', 'png', 'gif'] }).optional(),
  })
)
