import type { HttpContext } from '@adonisjs/core/http'
import { TableService } from '#services/table_service'
import { handleHttpError } from '#helpers/http_error'

export default class TableController {
  private tableService: TableService

  constructor() {
    this.tableService = new TableService()
  }

  async index({ response }: HttpContext) {
    try {
      const tables = await this.tableService.getAllActiveTables()

      return response.status(200).json({
        status: 'success',
        data: tables,
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
        data: {
          id: table.id,
          table_number: table.table_number,
          location_info: table.location_info,
        },
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }
}
