import type { HttpContext } from '@adonisjs/core/http'
import { CanteenService } from '#services/canteen_service'
import { MenuService } from '#services/menu_service'
import {
  getCanteensQueryValidator,
  getMenusByCanteenQueryValidator,
} from '#validators/user_validator'
import { handleHttpError } from '#helpers/http_error'

export default class CanteenController {
  private canteenService: CanteenService
  private menuService: MenuService

  constructor() {
    this.canteenService = new CanteenService()
    this.menuService = new MenuService()
  }

  async index({ request, response }: HttpContext) {
    try {
      const { page = 1, limit = 10 } = await request.validateUsing(getCanteensQueryValidator)
      const result = await this.canteenService.getAllCanteens(page, limit)

      return response.status(200).json({
        status: 'success',
        data: result.canteens,
        meta: result.meta,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const canteen = await this.canteenService.getCanteenById(params.id)

      if (!canteen) {
        return response.status(404).json({
          status: 'error',
          message: 'Canteen not found',
        })
      }

      return response.status(200).json({
        status: 'success',
        data: canteen,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async getMenus({ params, request, response }: HttpContext) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        search,
      } = await request.validateUsing(getMenusByCanteenQueryValidator)

      const result = await this.menuService.getMenusByCanteenId(
        params.canteenId,
        page,
        limit,
        category,
        search
      )

      return response.status(200).json({
        status: 'success',
        data: result.menus,
        meta: result.meta,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }
}
