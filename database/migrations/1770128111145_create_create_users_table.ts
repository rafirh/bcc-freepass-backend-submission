import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.string('email', 255).notNullable().unique()
      table.text('password_hash').notNullable()
      table
        .enu('role', ['user', 'owner', 'admin'], {
          useNative: true,
          existingType: true,
          enumName: 'user_role',
        })
        .notNullable()
        .defaultTo('user')
      table.string('full_name', 150).notNullable()
      table.string('phone_number', 20).nullable()
      table.text('avatar_url').nullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.boolean('is_verified').notNullable().defaultTo(false)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw('CREATE INDEX idx_users_email ON users (email)')
    this.schema.raw('CREATE INDEX idx_users_role ON users (role)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
