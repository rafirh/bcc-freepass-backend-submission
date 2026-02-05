import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('order_id').notNullable().references('id').inTable('orders').onDelete('CASCADE')
      table.uuid('menu_id').nullable().references('id').inTable('menus').onDelete('SET NULL')
      table.string('menu_name', 150).notNullable()
      table.integer('quantity').notNullable().checkPositive()
      table.decimal('unit_price', 10, 2).notNullable().checkPositive()
      table.decimal('subtotal', 12, 2).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw('CREATE INDEX idx_order_items_order_id ON order_items (order_id)')
    this.schema.raw('CREATE INDEX idx_order_items_menu_id ON order_items (menu_id)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
