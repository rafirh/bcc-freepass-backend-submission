import Table from '#models/table'

export interface CreateTableData {
  table_number: string
  barcode_value: string
  location_info?: string | null
  is_active?: boolean
}

export interface UpdateTableData {
  table_number?: string
  barcode_value?: string
  location_info?: string | null
  is_active?: boolean
}

export interface TableResponse {
  id: string
  table_number: string
  barcode_value: string
  location_info: string | null
  is_active: boolean
  created_at?: string | null
  updated_at?: string | null
}

export class TableService {
  async getAllTables(page: number, limit: number) {
    const tables = await Table.query()
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    const tableData = tables.all().map((table) => this.formatTableResponse(table))

    return {
      tables: tableData,
      meta: tables.getMeta(),
    }
  }

  async getTableById(id: string): Promise<TableResponse> {
    const table = await Table.findOrFail(id)
    return this.formatTableResponse(table)
  }

  async createTable(data: CreateTableData): Promise<TableResponse> {
    const existingTableNumber = await Table.query()
      .where('table_number', data.table_number)
      .first()

    if (existingTableNumber) {
      throw new Error('TABLE_NUMBER_EXISTS')
    }

    const existingBarcode = await Table.query()
      .where('barcode_value', data.barcode_value)
      .first()

    if (existingBarcode) {
      throw new Error('BARCODE_EXISTS')
    }

    const table = await Table.create({
      tableNumber: data.table_number,
      barcodeValue: data.barcode_value,
      locationInfo: data.location_info,
      isActive: data.is_active ?? true,
    })

    return this.formatTableResponse(table)
  }

  async updateTable(id: string, data: UpdateTableData): Promise<TableResponse> {
    const table = await Table.findOrFail(id)

    if (data.table_number !== undefined) {
      const existingTableNumber = await Table.query()
        .where('table_number', data.table_number)
        .whereNot('id', id)
        .first()

      if (existingTableNumber) {
        throw new Error('TABLE_NUMBER_EXISTS')
      }
      table.tableNumber = data.table_number
    }

    if (data.barcode_value !== undefined) {
      const existingBarcode = await Table.query()
        .where('barcode_value', data.barcode_value)
        .whereNot('id', id)
        .first()

      if (existingBarcode) {
        throw new Error('BARCODE_EXISTS')
      }
      table.barcodeValue = data.barcode_value
    }

    if (data.location_info !== undefined) {
      table.locationInfo = data.location_info
    }

    if (data.is_active !== undefined) {
      table.isActive = data.is_active
    }

    await table.save()
    return this.formatTableResponse(table)
  }

  async deleteTable(id: string): Promise<void> {
    const table = await Table.findOrFail(id)
    await table.delete()
  }

  private formatTableResponse(table: Table): TableResponse {
    return {
      id: table.id,
      table_number: table.tableNumber,
      barcode_value: table.barcodeValue,
      location_info: table.locationInfo,
      is_active: table.isActive,
      created_at: table.createdAt?.toISO(),
      updated_at: table.updatedAt?.toISO(),
    }
  }
}
