import { Hono } from "hono";

export function registerSwaggerEndpoint(app: Hono) {
  app.get("/api-spec", (c) => {
    return c.json({
      openapi: "3.0.0",
      info: {
        title: "Trust",
        version: "1.0.0",
        description: "API Trust",
      },
      tags: [
        {
          name: "Products",
          description: "Products Operation",
        },
      ],
      paths: {
        "/products": {
          get: {
            tags: ["Products"],
            summary: "Mendapatkan daftar produk",
            responses: {
              "200": {
                description: "success",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                        },
                        data: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/Product",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          post: {
            tags: ["Products"],
            summary: "Menambahkan produk baru",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Product",
                  },
                },
              },
              required: true,
            },
            responses: {
              "201": {
                description: "Produk berhasil ditambahkan",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                        },
                        data: {
                          $ref: "#/components/schemas/Product",
                        },
                      },
                    },
                  },
                },
              },
              "400": {
                description: "Permintaan tidak valid",
              },
            },
          },
        },
        "/products/{slug}": {
          get: {
            tags: ["Products"],
            summary: "Mendapatkan produk berdasarkan slug",
            parameters: [
              {
                name: "slug",
                in: "path",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "Produk berdasarkan slug berhasil diambil",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                        },
                        data: {
                          $ref: "#/components/schemas/Product",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          delete: {
            tags: ["Products"],
            summary: "Menghapus produk berdasarkan slug",
            parameters: [
              {
                name: "slug",
                in: "path",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "Produk berhasil dihapus",
              },
              "404": {
                description: "Produk tidak ditemukan",
              },
            },
          },
        },
        "/products/seed": {
          post: {
            tags: ["Products"],
            summary: "Post Seed Data",
            responses: {
              "201": {
                description: "Succes Add Seed Products",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: {
                          type: "string"
                        },
                        data: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/Product",
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      components: {
        schemas: {
          Product: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              name: {
                type: "string",
              },
              slug: {
                type: "string",
              },
              image_url: {
                type: "string",
              },
              description: {
                type: "string",
              },
              price: {
                type: "number",
              },
              category: {
                type: "string",
              },
              stock: {
                type: "number",
              },
            },
          },
        },
      },
    });
  });
}
