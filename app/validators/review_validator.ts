import vine from '@vinejs/vine'

export const createReviewValidator = vine.compile(
  vine.object({
    order_id: vine.string().uuid(),
    rating: vine.enum(['1', '2', '3', '4', '5']),
    comment: vine.string().trim().minLength(1).maxLength(1000).optional(),
  })
)
