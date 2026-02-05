import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reviews'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('order_id').notNullable().references('id').inTable('orders').onDelete('CASCADE')
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table
        .enu('rating', ['1', '2', '3', '4', '5'], {
          useNative: true,
          existingType: true,
          enumName: 'rating_scale',
        })
        .notNullable()
      table.text('comment').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.unique(['order_id', 'user_id'])
    })

    this.schema.raw('CREATE INDEX idx_reviews_order_id ON reviews (order_id)')
    this.schema.raw('CREATE INDEX idx_reviews_user_id ON reviews (user_id)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
