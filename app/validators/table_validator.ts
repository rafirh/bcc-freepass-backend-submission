import vine from '@vinejs/vine'

export const createTableValidator = vine.compile(
  vine.object({
    table_number: vine.string().trim().minLength(1).maxLength(20),
    barcode_value: vine.string().trim().minLength(1).maxLength(100),
    location_info: vine.string().trim().optional().nullable(),
    is_active: vine.boolean().optional(),
  })
)

export const updateTableValidator = vine.compile(
  vine.object({
    table_number: vine.string().trim().minLength(1).maxLength(20).optional(),
    barcode_value: vine.string().trim().minLength(1).maxLength(100).optional(),
    location_info: vine.string().trim().optional().nullable(),
    is_active: vine.boolean().optional(),
  })
)
