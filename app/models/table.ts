import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Table extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'table_number' })
  declare tableNumber: string

  @column({ columnName: 'barcode_value' })
  declare barcodeValue: string

  @column({ columnName: 'location_info' })
  declare locationInfo: string | null

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
