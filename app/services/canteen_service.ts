import Canteen from '#models/canteen'

export interface CreateCanteenData {
  name: string
  description?: string | null
  logo_url?: string | null
  location?: string | null
  status?: 'open' | 'closed'
  opening_hours?: string | null
}

export interface UpdateCanteenData {
  name?: string
  description?: string | null
  logo_url?: string | null
  location?: string | null
  status?: 'open' | 'closed'
  opening_hours?: string | null
}

export interface CanteenResponse {
  id: string
  owner_id: string
  name: string
  description: string | null
  logo_url: string | null
  location: string | null
  status: 'open' | 'closed'
  opening_hours: string | null
  created_at?: string | null
  updated_at?: string | null
}

export class CanteenService {
  async getAllCanteens(page: number, limit: number) {
    const canteens = await Canteen.query()
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    const canteenData = canteens.all().map((canteen) => this.formatCanteenResponse(canteen))

    return {
      canteens: canteenData,
      meta: canteens.getMeta(),
    }
  }

  async getCanteenById(id: string): Promise<CanteenResponse | null> {
    const canteen = await Canteen.query().where('id', id).first()

    if (!canteen) {
      return null
    }

    return this.formatCanteenResponse(canteen)
  }

  async getCanteenByOwnerId(ownerId: string): Promise<CanteenResponse | null> {
    const canteen = await Canteen.query().where('owner_id', ownerId).first()

    if (!canteen) {
      return null
    }

    return this.formatCanteenResponse(canteen)
  }

  async createCanteen(ownerId: string, data: CreateCanteenData): Promise<CanteenResponse> {
    const existingCanteen = await Canteen.query().where('owner_id', ownerId).first()

    if (existingCanteen) {
      throw new Error('OWNER_ALREADY_HAS_CANTEEN')
    }

    const canteen = await Canteen.create({
      ownerId,
      name: data.name,
      description: data.description,
      logoUrl: data.logo_url,
      location: data.location,
      status: data.status ?? 'open',
      openingHours: data.opening_hours,
    })

    return this.formatCanteenResponse(canteen)
  }

  async updateCanteen(ownerId: string, data: UpdateCanteenData): Promise<CanteenResponse> {
    const canteen = await Canteen.query().where('owner_id', ownerId).firstOrFail()

    if (data.name !== undefined) {
      canteen.name = data.name
    }

    if (data.description !== undefined) {
      canteen.description = data.description
    }

    if (data.logo_url !== undefined) {
      canteen.logoUrl = data.logo_url
    }

    if (data.location !== undefined) {
      canteen.location = data.location
    }

    if (data.status !== undefined) {
      canteen.status = data.status
    }

    if (data.opening_hours !== undefined) {
      canteen.openingHours = data.opening_hours
    }

    await canteen.save()
    return this.formatCanteenResponse(canteen)
  }

  private formatCanteenResponse(canteen: Canteen): CanteenResponse {
    return {
      id: canteen.id,
      owner_id: canteen.ownerId,
      name: canteen.name,
      description: canteen.description,
      logo_url: canteen.logoUrl,
      location: canteen.location,
      status: canteen.status,
      opening_hours: canteen.openingHours,
      created_at: canteen.createdAt?.toISO(),
      updated_at: canteen.updatedAt?.toISO(),
    }
  }
}
