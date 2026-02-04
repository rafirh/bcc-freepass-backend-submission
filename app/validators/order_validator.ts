import vine from '@vinejs/vine'

export const updateOrderStatusValidator = vine.compile(
  vine.object({
    order_status: vine.enum(['waiting', 'cooking', 'ready', 'completed']),
  })
)
