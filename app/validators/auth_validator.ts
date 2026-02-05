import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().trim().toLowerCase().email().maxLength(255),
    password: vine.string().minLength(8),
    full_name: vine.string().trim().minLength(2).maxLength(150),
    phone_number: vine
      .string()
      .trim()
      .regex(/^08\d{8,11}$/)
      .optional(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().toLowerCase().email(),
    password: vine.string().minLength(1),
  })
)

export const changePasswordValidator = vine.compile(
  vine.object({
    old_password: vine.string().minLength(1),
    new_password: vine.string().minLength(8),
  })
)
