import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  static environment = ['']
  async run() {
    const canteen = await db.from('canteens').where('name', 'Dapur Bu Sari').first()

    if (canteen) {
      await db.table('menus').multiInsert([
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteen.id,
          name: 'Es Teh',
          description: 'Sweet iced tea',
          price: 3000,
          category: 'drink',
          stock: 50,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteen.id,
          name: 'Es Jeruk',
          description: 'Fresh orange juice with ice',
          price: 5000,
          category: 'drink',
          stock: 30,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteen.id,
          name: 'Nasi Goreng',
          description: 'Indonesian fried rice with egg',
          price: 15000,
          category: 'food',
          stock: 20,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteen.id,
          name: 'Nasi Ayam Geprek',
          description: 'Rice with smashed fried chicken and spicy sambal',
          price: 18000,
          category: 'food',
          stock: 15,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteen.id,
          name: 'Nasi Soto',
          description: 'Rice with traditional Indonesian soto soup',
          price: 12000,
          category: 'food',
          stock: 25,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
    }
  }
}