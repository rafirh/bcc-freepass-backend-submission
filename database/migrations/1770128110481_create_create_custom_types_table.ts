import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.raw(`
      DROP TYPE IF EXISTS rating_scale CASCADE;
      DROP TYPE IF EXISTS order_status CASCADE;
      DROP TYPE IF EXISTS payment_method CASCADE;
      DROP TYPE IF EXISTS payment_status CASCADE;
      DROP TYPE IF EXISTS stock_status CASCADE;
      DROP TYPE IF EXISTS menu_category CASCADE;
      DROP TYPE IF EXISTS canteen_status CASCADE;
      DROP TYPE IF EXISTS user_role CASCADE;
    `)

    this.schema.raw(`
      -- User role in the system
      CREATE TYPE user_role AS ENUM ('user', 'owner', 'admin');

      -- Canteen status
      CREATE TYPE canteen_status AS ENUM ('open', 'closed');

      -- Menu category
      CREATE TYPE menu_category AS ENUM ('food', 'drink', 'snack', 'combo');

      -- Menu stock status
      CREATE TYPE stock_status AS ENUM ('available', 'out_of_stock');

      -- Payment status (from payment gateway)
      CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

      -- Payment method
      CREATE TYPE payment_method AS ENUM ('dana', 'gopay', 'ovo', 'shopeepay', 'qris', 'bank_transfer');

      -- Order status (flow: waiting -> cooking -> ready -> completed)
      CREATE TYPE order_status AS ENUM ('waiting', 'cooking', 'ready', 'completed', 'cancelled');

      -- Rating scale 1-5
      CREATE TYPE rating_scale AS ENUM ('1', '2', '3', '4', '5');
    `)
  }

  async down() {
    this.schema.raw(`
      DROP TYPE IF EXISTS rating_scale CASCADE;
      DROP TYPE IF EXISTS order_status CASCADE;
      DROP TYPE IF EXISTS payment_method CASCADE;
      DROP TYPE IF EXISTS payment_status CASCADE;
      DROP TYPE IF EXISTS stock_status CASCADE;
      DROP TYPE IF EXISTS menu_category CASCADE;
      DROP TYPE IF EXISTS canteen_status CASCADE;
      DROP TYPE IF EXISTS user_role CASCADE;
    `)
  }
}
