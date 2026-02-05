import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Order from '#models/order'
import Menu from '#models/menu'

export default class OrderItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'order_id' })
  declare orderId: string

  @column({ columnName: 'menu_id' })
  declare menuId: string | null

  @column({ columnName: 'menu_name' })
  declare menuName: string

  @column()
  declare quantity: number

  @column({ columnName: 'unit_price' })
  declare unitPrice: number

  @column()
  declare subtotal: number

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @belongsTo(() => Order, { foreignKey: 'orderId' })
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => Menu, { foreignKey: 'menuId' })
  declare menu: BelongsTo<typeof Menu>
}
