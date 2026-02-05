import Order from '#models/order'
import Canteen from '#models/canteen'

export interface UpdateOrderStatusData {
  order_status: 'waiting' | 'cooking' | 'ready' | 'completed'
}

export interface OrderResponse {
  id: string
  user_id: string
  canteen_id: string
  table_id: string
  order_status: 'waiting' | 'cooking' | 'ready' | 'completed' | 'cancelled'
  total_amount: number
  notes: string | null
  created_at?: string | null
  updated_at?: string | null
  user?: {
    id: string
    email: string
    full_name: string
    phone_number: string | null
  }
  canteen?: {
    id: string
    name: string
    location: string | null
  }
  table?: {
    id: string
    table_number: string
  }
  payment?: {
    id: string
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
    payment_method: string | null
    amount: number
  }
}

export class OrderService {
  async getOrdersByUserId(
    userId: string,
    page: number,
    limit: number,
    status?: 'waiting' | 'cooking' | 'ready' | 'completed' | 'cancelled'
  ) {
    const query = Order.query()
      .where('user_id', userId)
      .preload('canteen')
      .preload('table')
      .preload('payment')
      .orderBy('created_at', 'desc')

    if (status) {
      query.where('order_status', status)
    }

    const orders = await query.paginate(page, limit)

    const orderData = orders.all().map((order) => this.formatOrderResponse(order))

    return {
      orders: orderData,
      meta: orders.getMeta(),
    }
  }

  async getOrdersByOwnerId(
    ownerId: string,
    page: number,
    limit: number,
    status?: 'waiting' | 'cooking' | 'ready' | 'completed' | 'cancelled'
  ) {
    const canteen = await Canteen.query().where('owner_id', ownerId).firstOrFail()

    const query = Order.query()
      .where('canteen_id', canteen.id)
      .preload('user')
      .preload('table')
      .preload('payment')
      .orderBy('created_at', 'desc')

    if (status) {
      query.where('order_status', status)
    }

    const orders = await query.paginate(page, limit)

    const orderData = orders.all().map((order) => this.formatOrderResponse(order))

    return {
      orders: orderData,
      meta: orders.getMeta(),
    }
  }

  async getOrderDetail(ownerId: string, orderId: string): Promise<OrderResponse> {
    const canteen = await Canteen.query().where('owner_id', ownerId).firstOrFail()

    const order = await Order.query()
      .where('id', orderId)
      .where('canteen_id', canteen.id)
      .preload('user')
      .preload('table')
      .preload('payment')
      .firstOrFail()

    return this.formatOrderResponse(order)
  }

  async updateOrderStatus(
    ownerId: string,
    orderId: string,
    data: UpdateOrderStatusData
  ): Promise<OrderResponse> {
    const canteen = await Canteen.query().where('owner_id', ownerId).firstOrFail()

    const order = await Order.query()
      .where('id', orderId)
      .where('canteen_id', canteen.id)
      .firstOrFail()

    order.orderStatus = data.order_status
    await order.save()

    await order.load('user')
    await order.load('table')
    await order.load('payment')

    return this.formatOrderResponse(order)
  }

  private formatOrderResponse(order: Order): OrderResponse {
    const response: OrderResponse = {
      id: order.id,
      user_id: order.userId,
      canteen_id: order.canteenId,
      table_id: order.tableId,
      order_status: order.orderStatus,
      total_amount: order.totalAmount,
      notes: order.notes,
      created_at: order.createdAt?.toISO(),
      updated_at: order.updatedAt?.toISO(),
    }

    if (order.user) {
      response.user = {
        id: order.user.id,
        email: order.user.email,
        full_name: order.user.fullName,
        phone_number: order.user.phoneNumber,
      }
    }

    if (order.canteen) {
      response.canteen = {
        id: order.canteen.id,
        name: order.canteen.name,
        location: order.canteen.location,
      }
    }

    if (order.table) {
      response.table = {
        id: order.table.id,
        table_number: order.table.tableNumber,
      }
    }

    if (order.payment) {
      response.payment = {
        id: order.payment.id,
        payment_status: order.payment.paymentStatus,
        payment_method: order.payment.paymentMethod,
        amount: order.payment.amount,
      }
    }

    return response
  }
}
