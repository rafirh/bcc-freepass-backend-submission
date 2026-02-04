import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    const { response } = ctx

    // Check if error is an object with necessary properties
    if (error && typeof error === 'object') {
      const err = error as any

      // Handle 404 Not Found
      if (err.code === 'E_ROUTE_NOT_FOUND' || err.status === 404) {
        return response.status(404).json({
          status: 'error',
          message: 'Endpoint not found',
          path: ctx.request.url(),
        })
      }

      // Handle 401 Unauthorized
      if (err.code === 'E_UNAUTHORIZED_ACCESS' || err.status === 401) {
        return response.status(401).json({
          status: 'error',
          message: 'Unauthorized access',
        })
      }

      // Handle other HTTP exceptions with status codes
      if ('status' in err && typeof err.status === 'number') {
        const status = err.status || 500
        const message = err.message || 'Internal server error'

        return response.status(status).json({
          status: 'error',
          message: message,
        })
      }
    }

    // Default handler for unexpected errors
    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
