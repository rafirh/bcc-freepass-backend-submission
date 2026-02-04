import vine from '@vinejs/vine'

export const createCanteenValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(150),
    description: vine.string().trim().optional().nullable(),
    logo_url: vine.string().trim().url().optional().nullable(),
    location: vine.string().trim().maxLength(200).optional().nullable(),
    status: vine.enum(['open', 'closed']).optional(),
    opening_hours: vine.string().trim().optional().nullable(),
  })
)

export const updateCanteenValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(150).optional(),
    description: vine.string().trim().optional().nullable(),
    logo_url: vine.string().trim().url().optional().nullable(),
    location: vine.string().trim().maxLength(200).optional().nullable(),
    status: vine.enum(['open', 'closed']).optional(),
    opening_hours: vine.string().trim().optional().nullable(),
  })
)
