import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  static environment = ['']
  async run() {
    const canteenMieSabar = await db
      .from('canteens')
      .where('name', 'Mie Ayam Solo Pak Sabar')
      .first()
    if (canteenMieSabar) {
      await db.table('menus').multiInsert([
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteenMieSabar.id,
          name: 'Mie Ayam',
          description: 'Mie ayam khas Solo dengan topping ayam dan pangsit',
          price: 15000,
          category: 'food',
          stock: 30,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteenMieSabar.id,
          name: 'Bakso',
          description: 'Bakso sapi dengan kuah kaldu gurih',
          price: 12000,
          category: 'food',
          stock: 25,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteenMieSabar.id,
          name: 'Mie Yamin',
          description: 'Mie yamin dengan topping ayam jamur',
          price: 14000,
          category: 'food',
          stock: 20,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteenMieSabar.id,
          name: 'Es Teh',
          description: 'Es teh manis segar',
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
          canteen_id: canteenMieSabar.id,
          name: 'Es Jeruk',
          description: 'Jus jeruk segar dengan es',
          price: 5000,
          category: 'drink',
          stock: 40,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
    }

    const canteenBangGentong = await db
      .from('canteens')
      .where('name', 'Nasi Goreng Bang Gentong')
      .first()
    if (canteenBangGentong) {
      await db.table('menus').multiInsert([
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteenBangGentong.id,
          name: 'Nasi Goreng',
          description: 'Nasi goreng spesial dengan telur mata sapi',
          price: 15000,
          category: 'food',
          stock: 35,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteenBangGentong.id,
          name: 'Bakmie',
          description: 'Bakmie goreng dengan topping ayam',
          price: 14000,
          category: 'food',
          stock: 25,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteenBangGentong.id,
          name: 'Nasi Goreng Mawut',
          description: 'Nasi goreng campur mie dengan topping lengkap',
          price: 17000,
          category: 'food',
          stock: 20,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteenBangGentong.id,
          name: 'Es Teh',
          description: 'Es teh manis segar',
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
          canteen_id: canteenBangGentong.id,
          name: 'Es Jeruk',
          description: 'Jus jeruk segar dengan es',
          price: 5000,
          category: 'drink',
          stock: 40,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
    }

    const canteenGeprek = await db.from('canteens').where('name', 'Geprek Legend').first()
    if (canteenGeprek) {
      await db.table('menus').multiInsert([
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteenGeprek.id,
          name: 'Nasi Ayam Geprek',
          description: 'Nasi dengan ayam geprek sambal level 1-5',
          price: 18000,
          category: 'food',
          stock: 30,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteenGeprek.id,
          name: 'Nasi Ayam Geprek Bakar',
          description: 'Nasi dengan ayam geprek bakar sambal spesial',
          price: 20000,
          category: 'food',
          stock: 25,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteenGeprek.id,
          name: 'Nasi Ayam Geprek Keju',
          description: 'Nasi ayam geprek dengan topping keju mozzarella',
          price: 22000,
          category: 'food',
          stock: 20,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: db.rawQuery('gen_random_uuid()').knexQuery,
          canteen_id: canteenGeprek.id,
          name: 'Es Teh',
          description: 'Es teh manis segar',
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
          canteen_id: canteenGeprek.id,
          name: 'Air Mineral',
          description: 'Air mineral kemasan botol',
          price: 4000,
          category: 'drink',
          stock: 60,
          stock_status: 'available',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
    }
  }
}
