import type { HttpContext } from '@adonisjs/core/http'
import { TableService } from '#services/table_service'
import { createTableValidator, updateTableValidator } from '#validators/table_validator'
import { handleHttpError } from '#helpers/http_error'

export default class TableController {
  private tableService: TableService

  constructor() {
    this.tableService = new TableService()
  }

  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const result = await this.tableService.getAllTables(page, limit)

      return response.status(200).json({
        status: 'success',
        data: result.tables,
        meta: result.meta,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const table = await this.tableService.getTableById(params.id)

      return response.status(200).json({
        status: 'success',
        data: table,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createTableValidator)
      const table = await this.tableService.createTable(payload)

      return response.status(201).json({
        status: 'success',
        message: 'Table created successfully',
        data: table,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateTableValidator)
      const table = await this.tableService.updateTable(params.id, payload)

      return response.status(200).json({
        status: 'success',
        message: 'Table updated successfully',
        data: table,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      await this.tableService.deleteTable(params.id)

      return response.status(200).json({
        status: 'success',
        message: 'Table deleted successfully',
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }
}
