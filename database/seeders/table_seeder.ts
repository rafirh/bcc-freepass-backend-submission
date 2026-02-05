import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  static environment = ['']
  async run() {
    const tables = []

    for (let i = 1; i <= 10; i++) {
      tables.push({
        id: db.rawQuery('gen_random_uuid()').knexQuery,
        table_number: i.toString(),
        barcode_value: `TABLE-${i.toString().padStart(3, '0')}`,
        location_info: `Dining area, table number ${i}`,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
    }

    await db.table('tables').multiInsert(tables)
  }
}
