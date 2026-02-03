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

    // Validation functions and triggers
    this.schema.raw(`
      CREATE OR REPLACE FUNCTION validate_order_status_transition(
          current_status order_status,
          new_status     order_status
      ) RETURNS BOOLEAN AS $$
      BEGIN
          RETURN CASE
              WHEN current_status = 'waiting'   AND new_status IN ('cooking', 'cancelled') THEN TRUE
              WHEN current_status = 'cooking'   AND new_status = 'ready'                   THEN TRUE
              WHEN current_status = 'ready'     AND new_status = 'completed'               THEN TRUE
              ELSE FALSE
          END;
      END;
      $$ LANGUAGE plpgsql IMMUTABLE;

      CREATE OR REPLACE FUNCTION check_payment_before_cooking()
      RETURNS TRIGGER AS $$
      DECLARE
          payment_rec RECORD;
      BEGIN
          IF NEW.order_status = 'cooking' AND OLD.order_status = 'waiting' THEN
              SELECT payment_status INTO payment_rec FROM payments WHERE order_id = NEW.id;
              IF payment_rec.payment_status != 'paid' THEN
                  RAISE EXCEPTION 'Order must be paid before cooking.';
              END IF;
          END IF;

          IF NEW.order_status != OLD.order_status THEN
              IF NOT validate_order_status_transition(OLD.order_status, NEW.order_status) THEN
                  RAISE EXCEPTION 'Invalid status transition: % -> %', OLD.order_status, NEW.order_status;
              END IF;
          END IF;

          NEW.updated_at := NOW();
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trg_orders_check_payment
          BEFORE UPDATE ON orders
          FOR EACH ROW
          EXECUTE FUNCTION check_payment_before_cooking();
    `)
  }

  async down() {
    this.schema.raw('DROP TRIGGER IF EXISTS trg_orders_check_payment ON orders')
    this.schema.raw('DROP FUNCTION IF EXISTS check_payment_before_cooking()')
    this.schema.raw('DROP FUNCTION IF EXISTS validate_order_status_transition(order_status, order_status)')
    this.schema.dropTable(this.tableName)
  }
}