import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'orders'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
            table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
            table.uuid('canteen_id').notNullable().references('id').inTable('canteens').onDelete('CASCADE')
            table.uuid('table_id').notNullable().references('id').inTable('tables').onDelete('SET NULL')
            table.enu('order_status', ['waiting', 'cooking', 'ready', 'completed', 'cancelled'], {
                useNative: true,
                existingType: true,
                enumName: 'order_status'
            }).notNullable().defaultTo('waiting')
            table.decimal('total_amount', 12, 2).notNullable().defaultTo(0)
            table.text('notes').nullable()

            table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
            table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
        })

        this.schema.raw('CREATE INDEX idx_orders_user_id ON orders (user_id)')
        this.schema.raw('CREATE INDEX idx_orders_canteen_id ON orders (canteen_id)')
        this.schema.raw('CREATE INDEX idx_orders_table_id ON orders (table_id)')
        this.schema.raw('CREATE INDEX idx_orders_status ON orders (order_status)')
        this.schema.raw('CREATE INDEX idx_orders_created_at ON orders (created_at)')
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}