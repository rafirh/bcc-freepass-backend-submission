import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  static environment = ['']
  async run() {
    const owner = await db.from('users').where('email', 'ownerdemo@gmail.com').first()

    if (owner) {
      await db.table('canteens').insert({
        id: db.rawQuery('gen_random_uuid()').knexQuery,
        owner_id: owner.id,
        name: 'Dapur Bu Sari',
        description: 'Authentic Indonesian food with homemade taste',
        location: 'Outlet Number 5',
        status: 'open',
        opening_hours: '07:00 - 17:00',
        created_at: new Date(),
        updated_at: new Date(),
      })
    }
  }
}