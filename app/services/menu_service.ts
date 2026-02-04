import Menu from '#models/menu'
import Canteen from '#models/canteen'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import { unlink } from 'node:fs/promises'
import path from 'node:path'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

export interface CreateMenuData {
  name: string
  description?: string | null
  image?: MultipartFile
  price: number
  category?: 'food' | 'drink' | 'snack' | 'combo'
  stock?: number
  is_active?: boolean
}

export interface UpdateMenuData {
  name?: string
  description?: string | null
  image?: MultipartFile
  price?: number
  category?: 'food' | 'drink' | 'snack' | 'combo'
  stock?: number
  is_active?: boolean
}

export interface MenuResponse {
  id: string
  canteen_id: string
  name: string
  description: string | null
  image_url: string | null
  price: number
  category: 'food' | 'drink' | 'snack' | 'combo'
  stock: number
  stock_status: 'available' | 'out_of_stock'
  is_active: boolean
  created_at?: string | null
  updated_at?: string | null
}

export class MenuService {
  async getMenusByOwnerId(ownerId: string, page: number, limit: number) {
    const canteen = await Canteen.query().where('owner_id', ownerId).firstOrFail()

    const menus = await Menu.query()
      .where('canteen_id', canteen.id)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    const menuData = menus.all().map((menu) => this.formatMenuResponse(menu))

    return {
      menus: menuData,
      meta: menus.getMeta(),
    }
  }

  async createMenu(ownerId: string, data: CreateMenuData): Promise<MenuResponse> {
    const canteen = await Canteen.query().where('owner_id', ownerId).firstOrFail()

    const menu = await Menu.create({
      canteenId: canteen.id,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category ?? 'food',
      stock: data.stock ?? 0,
      isActive: data.is_active ?? true,
    })

    if (data.image) {
      await this.handleImageUpload(menu, data.image)
      await menu.save()
    }

    return this.formatMenuResponse(menu)
  }

  async updateMenu(ownerId: string, menuId: string, data: UpdateMenuData): Promise<MenuResponse> {
    const canteen = await Canteen.query().where('owner_id', ownerId).firstOrFail()

    const menu = await Menu.query()
      .where('id', menuId)
      .where('canteen_id', canteen.id)
      .firstOrFail()

    if (data.name !== undefined) {
      menu.name = data.name
    }

    if (data.description !== undefined) {
      menu.description = data.description
    }

    if (data.image) {
      await this.handleImageUpload(menu, data.image)
    }

    if (data.price !== undefined) {
      menu.price = data.price
    }

    if (data.category !== undefined) {
      menu.category = data.category
    }

    if (data.stock !== undefined) {
      menu.stock = data.stock
    }

    if (data.is_active !== undefined) {
      menu.isActive = data.is_active
    }

    await menu.save()
    return this.formatMenuResponse(menu)
  }

  async deleteMenu(ownerId: string, menuId: string): Promise<void> {
    const canteen = await Canteen.query().where('owner_id', ownerId).firstOrFail()

    const menu = await Menu.query()
      .where('id', menuId)
      .where('canteen_id', canteen.id)
      .firstOrFail()

    if (menu.imageUrl) {
      await this.deleteOldImage(menu.imageUrl)
    }

    await menu.delete()
  }

  private async handleImageUpload(menu: Menu, image: MultipartFile): Promise<void> {
    if (menu.imageUrl) {
      await this.deleteOldImage(menu.imageUrl)
    }

    const imageName = `${cuid()}.${image.extname}`
    await image.move(app.makePath('public/uploads/menus'), {
      name: imageName,
    })

    menu.imageUrl = `/uploads/menus/${imageName}`
  }

  private async deleteOldImage(imageUrl: string): Promise<void> {
    try {
      const oldImagePath = app.makePath('public/uploads/menus', path.basename(imageUrl))
      await unlink(oldImagePath)
    } catch (error) {
      console.error('Error deleting old image:', error)
    }
  }

  private formatMenuResponse(menu: Menu): MenuResponse {
    return {
      id: menu.id,
      canteen_id: menu.canteenId,
      name: menu.name,
      description: menu.description,
      image_url: menu.imageUrl,
      price: menu.price,
      category: menu.category,
      stock: menu.stock,
      stock_status: menu.stockStatus,
      is_active: menu.isActive,
      created_at: menu.createdAt?.toISO(),
      updated_at: menu.updatedAt?.toISO(),
    }
  }
}
