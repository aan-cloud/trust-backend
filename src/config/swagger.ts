import { Hono } from "hono"

export function registerSwaggerEndpoint(app: Hono) {
    app.get('/api-doc', (c) => {
  return c.json({
    openapi: '3.0.0',
    info: {
      title: 'Trust',
      version: '1.0.0',
      description: 'API Trust',
    },
    tags: [
        {
            name: 'Products',
            description: 'Products Operation'
        }
    ],
    paths: {
      '/products': {
        get: {
          summary: 'Mendapatkan daftar product',
          responses: {
            '200': {
              description: 'Daftar product berhasil diambil',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string'
                        },
                        data: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Product'
                            } 
                        },
                    },
                  },
                },
              },
            },
          },
        },
    },
      '/products/{id}': {
        get: {
          summary: 'Mendapatkan product berdasarkan ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Pengguna berdasar kan ID berhasil diambil',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string'
                        },
                        data: {
                            $ref: '#/components/schemas/Product',
                        }
                    }
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            imageUrl: {
              type: 'string',
            },
            title: {
                type: 'string'
            },
            category: {
                type: 'string'
            },
            stock: {
                type: 'string'
            },
            price: {
                type: 'number'
            }
          },
        },
      },
    },
  })
})
}