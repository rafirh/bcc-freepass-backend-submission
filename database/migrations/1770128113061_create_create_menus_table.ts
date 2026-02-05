import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'menus'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('canteen_id').notNullable().references('id').inTable('canteens').onDelete('CASCADE')
      table.string('name', 150).notNullable()
      table.text('description').nullable()
      table.text('image_url').nullable()
      table.decimal('price', 10, 2).notNullable().checkPositive()
      table.enu('category', ['food', 'drink', 'snack'], {
        useNative: true,
        existingType: true,
        enumName: 'menu_category'
      }).notNullable().defaultTo('food')
      table.integer('stock').notNullable().defaultTo(0).checkPositive()
      table.enu('stock_status', ['available', 'out_of_stock'], {
        useNative: true,
        existingType: true,
        enumName: 'stock_status'
      }).notNullable().defaultTo('out_of_stock')
      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw('CREATE INDEX idx_menus_canteen_id ON menus (canteen_id)')
    this.schema.raw('CREATE INDEX idx_menus_category ON menus (category)')
    this.schema.raw('CREATE INDEX idx_menus_stock_status ON menus (stock_status)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}