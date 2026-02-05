import Order from '#models/order'
import Canteen from '#models/canteen'
import Menu from '#models/menu'
import Payment from '#models/payment'
import OrderItem from '#models/order_item'
import Table from '#models/table'
import midtransClient from 'midtrans-client'
import midtransConfig from '#config/midtrans'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export interface UpdateOrderStatusData {
  order_status: 'waiting' | 'cooking' | 'ready' | 'completed'
}

export interface CreateOrderItem {
  menu_id: string
  quantity: number
}

export interface CreateOrderData {
  items: CreateOrderItem[]
  table_id: string
  notes?: string
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
  private snap: midtransClient.Snap

  constructor() {
    this.snap = new midtransClient.Snap({
      isProduction: midtransConfig.isProduction,
      serverKey: midtransConfig.serverKey,
      clientKey: midtransConfig.clientKey,
    })
  }

  async createOrder(userId: string, data: CreateOrderData) {
    if (!data.items || data.items.length === 0) {
      throw new Error('Order must contain at least one item')
    }

    const menuIds = data.items.map((item) => item.menu_id)
    const menus = await Menu.query().whereIn('id', menuIds)

    if (menus.length !== menuIds.length) {
      throw new Error('One or more menu items not found')
    }

    const canteenIds = [...new Set(menus.map((menu) => menu.canteenId))]
    if (canteenIds.length > 1) {
      throw new Error('All menu items must be from the same canteen')
    }

    for (const menu of menus) {
      const orderItem = data.items.find((item) => item.menu_id === menu.id)
      if (!orderItem) continue

      if (!menu.isActive) {
        throw new Error(`Menu item ${menu.name} is not active`)
      }
      if (menu.stockStatus === 'out_of_stock') {
        throw new Error(`Menu item ${menu.name} is out of stock`)
      }
      if (menu.stock < orderItem.quantity) {
        throw new Error(`Insufficient stock for ${menu.name}`)
      }
    }

    await Table.findOrFail(data.table_id)

    const canteenId = menus[0].canteenId

    let totalAmount = 0
    const orderItems: Array<{ menuId: string; quantity: number; unitPrice: number }> = []

    for (const item of data.items) {
      const menu = menus.find((m) => m.id === item.menu_id)
      if (!menu) continue

      const subtotal = menu.price * item.quantity
      totalAmount += subtotal

      orderItems.push({
        menuId: menu.id,
        quantity: item.quantity,
        unitPrice: menu.price,
      })
    }

    const trx = await db.transaction()

    try {
      const order = new Order()
      order.userId = userId
      order.canteenId = canteenId
      order.tableId = data.table_id
      order.orderStatus = 'waiting'
      order.totalAmount = totalAmount
      order.notes = data.notes || null
      order.useTransaction(trx)
      await order.save()

      for (const item of orderItems) {
        const menu = menus.find((m) => m.id === item.menuId)!

        const orderItem = new OrderItem()
        orderItem.orderId = order.id
        orderItem.menuId = item.menuId
        orderItem.menuName = menu.name
        orderItem.quantity = item.quantity
        orderItem.unitPrice = item.unitPrice
        orderItem.subtotal = item.unitPrice * item.quantity
        orderItem.useTransaction(trx)
        await orderItem.save()

        menu.stock -= item.quantity
        if (menu.stock === 0) {
          menu.stockStatus = 'out_of_stock'
        }
        menu.useTransaction(trx)
        await menu.save()
      }

      const midtransParams = {
        transaction_details: {
          order_id: order.id,
          gross_amount: totalAmount,
        },
        customer_details: {
          first_name: userId,
        },
        item_details: orderItems.map((item) => {
          const menu = menus.find((m) => m.id === item.menuId)!
          return {
            id: item.menuId,
            price: item.unitPrice,
            quantity: item.quantity,
            name: menu.name,
          }
        }),
      }

      const transaction = await this.snap.createTransaction(midtransParams)

      const payment = new Payment()
      payment.orderId = order.id
      payment.paymentStatus = 'pending'
      payment.amount = totalAmount
      payment.gatewayTransactionId = transaction.token
      payment.useTransaction(trx)
      await payment.save()

      await trx.commit()

      await order.load('user')
      await order.load('canteen')
      await order.load('table')
      await order.load('payment')
      await order.load('items')

      return {
        order: this.formatOrderResponse(order),
        payment_url: transaction.redirect_url,
        payment_token: transaction.token,
      }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

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

  async handleMidtransWebhook(notificationData: any) {
    const orderId = notificationData.order_id
    const transactionStatus = notificationData.transaction_status
    const fraudStatus = notificationData.fraud_status

    const order = await Order.query().where('id', orderId).preload('payment').firstOrFail()

    if (!order.payment) {
      throw new Error('Payment record not found for this order')
    }

    const payment = order.payment

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        payment.paymentStatus = 'paid'
        payment.paidAt = DateTime.now()
      }
    } else if (transactionStatus === 'settlement') {
      payment.paymentStatus = 'paid'
      payment.paidAt = DateTime.now()
    } else if (
      transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire'
    ) {
      payment.paymentStatus = 'failed'
      order.orderStatus = 'cancelled'

      await order.load('items')
      for (const item of order.items) {
        if (item.menuId) {
          const menu = await Menu.find(item.menuId)
          if (menu) {
            menu.stock += item.quantity
            if (menu.stock > 0) {
              menu.stockStatus = 'available'
            }
            await menu.save()
          }
        }
      }
    } else if (transactionStatus === 'pending') {
      payment.paymentStatus = 'pending'
    }

    if (notificationData.payment_type) {
      const paymentTypeMap: Record<string, Payment['paymentMethod']> = {
        gopay: 'gopay',
        shopeepay: 'shopeepay',
        qris: 'qris',
        bank_transfer: 'bank_transfer',
      }
      payment.paymentMethod = paymentTypeMap[notificationData.payment_type] || null
    }

    await payment.save()
    await order.save()

    return {
      success: true,
      order_id: orderId,
      payment_status: payment.paymentStatus,
    }
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
