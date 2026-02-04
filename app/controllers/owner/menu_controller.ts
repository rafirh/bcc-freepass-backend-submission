import type { HttpContext } from '@adonisjs/core/http'
import { MenuService } from '#services/menu_service'
import { createMenuValidator, updateMenuValidator } from '#validators/menu_validator'
import { handleHttpError } from '#helpers/http_error'

export default class MenuController {
  private menuService: MenuService

  constructor() {
    this.menuService = new MenuService()
  }

  async index({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const result = await this.menuService.getMenusByOwnerId(user.id, page, limit)

      return response.status(200).json({
        status: 'success',
        data: result.menus,
        meta: result.meta,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async store({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(createMenuValidator)
      const menu = await this.menuService.createMenu(user.id, payload)

      return response.status(201).json({
        status: 'success',
        message: 'Menu created successfully',
        data: menu,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(updateMenuValidator)
      const menu = await this.menuService.updateMenu(user.id, params.id, payload)

      return response.status(200).json({
        status: 'success',
        message: 'Menu updated successfully',
        data: menu,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      await this.menuService.deleteMenu(user.id, params.id)

      return response.status(200).json({
        status: 'success',
        message: 'Menu deleted successfully',
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }
}
