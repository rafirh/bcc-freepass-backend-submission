import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Canteen from '#models/canteen'
import Table from '#models/table'
import Payment from '#models/payment'
import OrderItem from '#models/order_item'
import Review from '#models/review'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'user_id' })
  declare userId: string

  @column({ columnName: 'canteen_id' })
  declare canteenId: string

  @column({ columnName: 'table_id' })
  declare tableId: string

  @column({ columnName: 'order_status' })
  declare orderStatus: 'waiting' | 'cooking' | 'ready' | 'completed' | 'cancelled'

  @column({ columnName: 'total_amount' })
  declare totalAmount: number

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Canteen, { foreignKey: 'canteenId' })
  declare canteen: BelongsTo<typeof Canteen>

  @belongsTo(() => Table, { foreignKey: 'tableId' })
  declare table: BelongsTo<typeof Table>

  @hasOne(() => Payment, { foreignKey: 'orderId' })
  declare payment: HasOne<typeof Payment>

  @hasMany(() => OrderItem, { foreignKey: 'orderId' })
  declare items: HasMany<typeof OrderItem>

  @hasOne(() => Review, { foreignKey: 'orderId' })
  declare review: HasOne<typeof Review>
}
