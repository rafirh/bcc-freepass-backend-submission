import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Canteen extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'owner_id' })
  declare ownerId: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column({ columnName: 'logo_url' })
  declare logoUrl: string | null

  @column()
  declare location: string | null

  @column()
  declare status: 'open' | 'closed'

  @column({ columnName: 'opening_hours' })
  declare openingHours: string | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>
}
