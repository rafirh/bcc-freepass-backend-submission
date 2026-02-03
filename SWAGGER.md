# Swagger API Documentation

## Overview
This project uses `adonis-autoswagger` for automatic API documentation generation.

## Access Documentation

Once the server is running, you can access the Swagger documentation at:

- **Swagger UI**: http://localhost:3333/docs
- **Swagger JSON**: http://localhost:3333/swagger

## How to Document APIs

### Using JSDoc Comments

Add JSDoc comments above your routes or in your controllers:

```typescript
/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/users', [UsersController, 'index'])
```

### Authentication

The API uses Bearer Token authentication. To test authenticated endpoints:

1. Go to http://localhost:3333/docs
2. Click the "Authorize" button
3. Enter your bearer token
4. Click "Authorize"

### Configuration

Swagger configuration can be found in `config/swagger.ts`:

- **title**: API title
- **version**: API version
- **description**: API description
- **securitySchemes**: Authentication schemes
- **authMiddlewares**: Authentication middleware names

## Examples

See the following files for examples:
- `start/routes.ts` - Basic route documentation
- `app/controllers/health_controller.ts` - Controller documentation

## Resources

- [adonis-autoswagger Documentation](https://github.com/ad-on-is/adonis-autoswagger)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
