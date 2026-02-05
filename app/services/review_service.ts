import Review from '#models/review'
import Order from '#models/order'

export interface CreateReviewData {
  order_id: string
  rating: '1' | '2' | '3' | '4' | '5'
  comment?: string
}

export interface ReviewResponse {
  id: string
  order_id: string
  user_id: string
  rating: '1' | '2' | '3' | '4' | '5'
  comment: string | null
  created_at?: string | null
  updated_at?: string | null
}

export class ReviewService {
  async createReview(userId: string, data: CreateReviewData): Promise<ReviewResponse> {
    const order = await Order.query()
      .where('id', data.order_id)
      .where('user_id', userId)
      .firstOrFail()

    await order.load('payment')
    if (!order.payment || order.payment.paymentStatus !== 'paid') {
      throw new Error('ORDER_NOT_PAID')
    }

    const existingReview = await Review.query()
      .where('order_id', data.order_id)
      .where('user_id', userId)
      .first()

    if (existingReview) {
      throw new Error('REVIEW_ALREADY_EXISTS')
    }

    const review = new Review()
    review.orderId = data.order_id
    review.userId = userId
    review.rating = data.rating
    review.comment = data.comment || null
    await review.save()

    return this.formatReviewResponse(review)
  }

  private formatReviewResponse(review: Review): ReviewResponse {
    return {
      id: review.id,
      order_id: review.orderId,
      user_id: review.userId,
      rating: review.rating,
      comment: review.comment,
      created_at: review.createdAt?.toISO(),
      updated_at: review.updatedAt?.toISO(),
    }
  }
}
