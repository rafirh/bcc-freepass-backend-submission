import type { HttpContext } from '@adonisjs/core/http'
import { TableService } from '#services/table_service'

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
      console.error('Get tables error:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      })
    }
  }
}
