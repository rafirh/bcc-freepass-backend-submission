import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'canteens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('owner_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('name', 150).notNullable()
      table.text('description').nullable()
      table.text('logo_url').nullable()
      table.string('location', 200).nullable()
      table.enu('status', ['open', 'closed'], {
        useNative: true,
        existingType: true,
        enumName: 'canteen_status'
      }).notNullable().defaultTo('open')
      table.text('opening_hours').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.unique(['owner_id'])
    })

    this.schema.raw('CREATE INDEX idx_canteens_owner_id ON canteens (owner_id)')
    this.schema.raw('CREATE INDEX idx_canteens_status ON canteens (status)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}