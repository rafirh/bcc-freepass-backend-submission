import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table
        .uuid('order_id')
        .notNullable()
        .unique()
        .references('id')
        .inTable('orders')
        .onDelete('CASCADE')
      table
        .enu('payment_status', ['pending', 'paid', 'failed', 'refunded'], {
          useNative: true,
          existingType: true,
          enumName: 'payment_status',
        })
        .notNullable()
        .defaultTo('pending')
      table
        .enu('payment_method', ['dana', 'gopay', 'ovo', 'shopeepay', 'qris', 'bank_transfer'], {
          useNative: true,
          existingType: true,
          enumName: 'payment_method',
        })
        .nullable()
      table.decimal('amount', 12, 2).notNullable().checkPositive()
      table.text('gateway_transaction_id').nullable()
      table.jsonb('gateway_response').nullable()
      table.timestamp('paid_at', { useTz: true }).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw('CREATE INDEX idx_payments_order_id ON payments (order_id)')
    this.schema.raw('CREATE INDEX idx_payments_status ON payments (payment_status)')
    this.schema.raw('CREATE INDEX idx_payments_gateway_txn_id ON payments (gateway_transaction_id)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
