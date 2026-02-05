import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Order from '#models/order'

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'order_id' })
  declare orderId: string

  @column({ columnName: 'user_id' })
  declare userId: string

  @column()
  declare rating: '1' | '2' | '3' | '4' | '5'

  @column()
  declare comment: string | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Order, { foreignKey: 'orderId' })
  declare order: BelongsTo<typeof Order>
}
