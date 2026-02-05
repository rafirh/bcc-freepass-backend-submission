import type { HttpContext } from '@adonisjs/core/http'
import { ReviewService } from '#services/review_service'
import { createReviewValidator } from '#validators/review_validator'
import { handleHttpError } from '#helpers/http_error'

export default class ReviewController {
  private reviewService: ReviewService

  constructor() {
    this.reviewService = new ReviewService()
  }

  async store({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const data = await request.validateUsing(createReviewValidator)

      const review = await this.reviewService.createReview(user.id, data)

      return response.status(201).json({
        status: 'success',
        message: 'Review created successfully',
        data: review,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }
}
