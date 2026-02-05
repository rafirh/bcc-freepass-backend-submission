import { BaseSeeder } from '@adonisjs/lucid/seeders'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  static environment = ['']
  async run() {
    await db.table('users').multiInsert([
      {
        id: db.rawQuery('gen_random_uuid()').knexQuery,
        email: 'userdemo@gmail.com',
        password_hash: await hash.make('userdemo123'),
        role: 'user',
        full_name: 'User Demo',
        phone_number: '081234567890',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: db.rawQuery('gen_random_uuid()').knexQuery,
        email: 'admindemo@gmail.com',
        password_hash: await hash.make('admindemo123'),
        role: 'admin',
        full_name: 'Admin Demo',
        phone_number: '081234567892',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: db.rawQuery('gen_random_uuid()').knexQuery,
        email: 'ownerdemo@gmail.com',
        password_hash: await hash.make('ownerdemo123'),
        role: 'owner',
        full_name: 'Pak Sabar',
        phone_number: '081234567893',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: db.rawQuery('gen_random_uuid()').knexQuery,
        email: 'owner.banggentong@gmail.com',
        password_hash: await hash.make('owner123'),
        role: 'owner',
        full_name: 'Bang Gentong',
        phone_number: '081234567894',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: db.rawQuery('gen_random_uuid()').knexQuery,
        email: 'owner.gepreklegend@gmail.com',
        password_hash: await hash.make('owner123'),
        role: 'owner',
        full_name: 'Owner Geprek Legend',
        phone_number: '081234567895',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  }
}