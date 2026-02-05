import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  static environment = ['']
  async run() {
    const ownerMieSabar = await db.from('users').where('email', 'ownerdemo@gmail.com').first()
    if (ownerMieSabar) {
      await db.table('canteens').insert({
        id: db.rawQuery('gen_random_uuid()').knexQuery,
        owner_id: ownerMieSabar.id,
        name: 'Mie Ayam Solo Pak Sabar',
        description: 'Mie ayam khas Solo dengan resep turun temurun',
        location: 'Outlet Number 1',
        status: 'open',
        opening_hours: '08:00 - 16:00',
        created_at: new Date(),
        updated_at: new Date(),
      })
    }

    const ownerBangGentong = await db
      .from('users')
      .where('email', 'owner.banggentong@gmail.com')
      .first()
    if (ownerBangGentong) {
      await db.table('canteens').insert({
        id: db.rawQuery('gen_random_uuid()').knexQuery,
        owner_id: ownerBangGentong.id,
        name: 'Nasi Goreng Bang Gentong',
        description: 'Nasi goreng legendaris dengan cita rasa khas',
        location: 'Outlet Number 2',
        status: 'open',
        opening_hours: '10:00 - 22:00',
        created_at: new Date(),
        updated_at: new Date(),
      })
    }

    const ownerGeprek = await db
      .from('users')
      .where('email', 'owner.gepreklegend@gmail.com')
      .first()
    if (ownerGeprek) {
      await db.table('canteens').insert({
        id: db.rawQuery('gen_random_uuid()').knexQuery,
        owner_id: ownerGeprek.id,
        name: 'Geprek Legend',
        description: 'Ayam geprek dengan berbagai varian dan tingkat kepedasan',
        location: 'Outlet Number 3',
        status: 'open',
        opening_hours: '09:00 - 21:00',
        created_at: new Date(),
        updated_at: new Date(),
      })
    }
  }
}
