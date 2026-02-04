import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Canteen from '#models/canteen'

export default class Menu extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'canteen_id' })
  declare canteenId: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column({ columnName: 'image_url' })
  declare imageUrl: string | null

  @column()
  declare price: number

  @column()
  declare category: 'food' | 'drink' | 'snack' | 'combo'

  @column()
  declare stock: number

  @column({ columnName: 'stock_status' })
  declare stockStatus: 'available' | 'out_of_stock'

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => Canteen, {
    foreignKey: 'canteenId',
  })
  declare canteen: BelongsTo<typeof Canteen>
}
