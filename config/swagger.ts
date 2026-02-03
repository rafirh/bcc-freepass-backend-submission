import path from 'node:path'

export default {
  path: path.resolve('./'),
  title: 'BCC Canteen API',
  version: '1.0.0',
  description: 'API documentation for BCC Canteen Backend',
  tagIndex: 3,
  snakeCase: true,
  debug: false,
  ignore: ['/swagger', '/docs'],
  preferredPutPatch: 'PUT',
  common: {
    parameters: {},
    headers: {},
  },
  securitySchemes: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter your bearer token',
    },
  },
  authMiddlewares: ['auth'],
  defaultSecurityScheme: 'BearerAuth',
  persistAuthorization: true,
  showFullPath: false,
}
