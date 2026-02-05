import vine from '@vinejs/vine'

export const createOrderValidator = vine.compile(
  vine.object({
    items: vine
      .array(
        vine.object({
          menu_id: vine.string().uuid(),
          quantity: vine.number().min(1),
        })
      )
      .minLength(1),
    table_id: vine.string().uuid(),
    notes: vine.string().optional(),
  })
)

export const updateOrderStatusValidator = vine.compile(
  vine.object({
    order_status: vine.enum(['waiting', 'cooking', 'ready', 'completed']),
  })
)
