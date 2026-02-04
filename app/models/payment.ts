import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Order from '#models/order'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'order_id' })
  declare orderId: string

  @column({ columnName: 'payment_status' })
  declare paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'

  @column({ columnName: 'payment_method' })
  declare paymentMethod: 'dana' | 'gopay' | 'ovo' | 'shopeepay' | 'qris' | 'bank_transfer' | null

  @column()
  declare amount: number

  @column({ columnName: 'gateway_transaction_id' })
  declare gatewayTransactionId: string | null

  @column({ columnName: 'paid_at' })
  declare paidAt: DateTime | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => Order, { foreignKey: 'orderId' })
  declare order: BelongsTo<typeof Order>
}
