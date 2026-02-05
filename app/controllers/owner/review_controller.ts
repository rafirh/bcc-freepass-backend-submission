import type { HttpContext } from '@adonisjs/core/http'
import { ReviewService } from '#services/review_service'
import { CanteenService } from '#services/canteen_service'
import { handleHttpError } from '#helpers/http_error'

export default class ReviewController {
  private reviewService: ReviewService
  private canteenService: CanteenService

  constructor() {
    this.reviewService = new ReviewService()
    this.canteenService = new CanteenService()
  }

  async index({ auth, request, response }: HttpContext) {
    try {
      const owner = auth.getUserOrFail()
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const canteen = await this.canteenService.getCanteenByOwnerId(owner.id)
      if (!canteen) {
        return response.status(404).json({
          status: 'error',
          message: 'Canteen not found',
        })
      }

      const result = await this.reviewService.getReviewsByCanteenId(canteen.id, page, limit)

      return response.status(200).json({
        status: 'success',
        data: result.reviews,
        meta: result.meta,
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }

  async destroy({ auth, params, response }: HttpContext) {
    try {
      const owner = auth.getUserOrFail()

      const canteen = await this.canteenService.getCanteenByOwnerId(owner.id)
      if (!canteen) {
        return response.status(404).json({
          status: 'error',
          message: 'Canteen not found',
        })
      }

      await this.reviewService.deleteReviewByOwner(params.id, canteen.id)

      return response.status(200).json({
        status: 'success',
        message: 'Review deleted successfully',
      })
    } catch (error) {
      return handleHttpError(error, response)
    }
  }
}
