import vine from '@vinejs/vine'

export const updateProfileValidator = vine.compile(
  vine.object({
    full_name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(150)
      .optional(),
    phone_number: vine
      .string()
      .trim()
      .regex(/^08\d{8,11}$/)
      .optional()
      .nullable(),
    avatar: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'gif'],
      })
      .optional(),
  })
)
