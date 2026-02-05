import vine from '@vinejs/vine'

export const createMenuValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(150),
    description: vine.string().trim().optional().nullable(),
    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'gif'],
      })
      .optional(),
    price: vine.number().min(0),
    category: vine.enum(['food', 'drink', 'snack', 'combo']).optional(),
    stock: vine.number().min(0).optional(),
    is_active: vine.boolean().optional(),
  })
)

export const updateMenuValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(150).optional(),
    description: vine.string().trim().optional().nullable(),
    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'gif'],
      })
      .optional(),
    price: vine.number().min(0).optional(),
    category: vine.enum(['food', 'drink', 'snack', 'combo']).optional(),
    stock: vine.number().min(0).optional(),
    is_active: vine.boolean().optional(),
  })
)
