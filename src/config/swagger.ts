import { password } from "bun";
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
        {
          name: "Categories",
          description: "Products Categories Operation",
        },
        {
          name: "Auth",
          description: "authentication user"
        },
        {
          name: "User",
          description: "get user"
        }
      ],
      paths: {
        "/products": {
          get: {
            tags: ["Products"],
            summary: "Mendapatkan daftar produk",
            parameters: [
              {
                name: "name",
                in: "query",
                required: false,
                schema: {
                  type: "string",
                },
              },
            ],
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
          delete: {
            tags: ["Products"],
            summary: "Menghapus semua product",
            responses: {
              "200": {
                description: "Produk berhasil dihapus",
              },
              "404": {
                description: "Produk tidak ditemukan",
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
            summary: "Get products by slug",
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
                description: "Succes get products by slug",
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
        },
        "/categories": {
          get: {
            tags: ["Categories"],
            summary: "Mendapat kan semua categories",
            parameters: [
              {
                name: "category",
                in: "query",
                required: false,
                schema: {
                  type: "string",
                },
              },
            ],
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
                            $ref: "#/components/schemas/Categories",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/categories/{slug}": {
          get: {
            tags: ["Categories"],
            summary: "Get categories slug, including products",
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
                description: "Succes get producst category by slug",
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
              "404": {
                description: "Produk tidak ditemukan",
              },
            },
          },
        },
        "/user": {
          get: {
            tags: ["User"],
            summary: "get all user",
            responses: {
              200: {
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
                            $ref: "#/components/schemas/Users",
                          },
                        },
                      },
                    },
                  },
                },
              }
            }
          }
        },
        "/user/{username}": {
          get: {
            tags: ["User"],
            summary: "get all user",
            parameters: [
              {
                name: "username",
                in: "path",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              200: {
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
                            $ref: "#/components/schemas/Users",
                          },
                        },
                      },
                    },
                  },
                },
              }
            }
          }
        },
        "/auth/register": {
          post: {
            tags: ["Auth"],
            summary: "Register new user",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Register",
                  },
                },
              },
              required: true,
            },
            responses: {
              "201": {
                description: "Register succes",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                        },
                        data: {
                          $ref: "#/components/schemas/Register",
                        },
                      },
                    },
                  },
                },
              },
              "400": {
                description: "Error",
              },
            },
          },
        },
        "/auth/login": {
          post: {
            tags: ["Auth"],
            summary: "user login",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Login",
                  },
                },
              },
              required: true,
            },
            responses: {
              "201": {
                description: "Login success",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                        },
                        data: {
                          $ref: "#/components/schemas/Login",
                        },
                      },
                    },
                  },
                },
              },
              "400": {
                description: "Error",
              },
            },
          },
        },
        "/auth/me": {
          get: {
            tags: ["Auth"],
            summary: "Get user profile",
            security: [{ AuthorizationBearer: [] }],
            responses: {
              "200": {
                description: "Authorized",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                        data: { $ref: "#/components/schemas/Profile" },
                      },
                    },
                  },
                },
              },
              "401": {
                description: "Unauthorized",
              },
            },
          }
        },
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
          Categories: {
            type: "object",
            properties: {
              id: {
                type: "number",
              },
              name: {
                type: "string",
              },
              slug: {
                type: "string",
              },
            },
          },
          Users: {
            type: "object",
            properties: {
              id: {
                type: "number"
              },
              username: {
                type: "string"
              },
            }
          },
          Register: {
            type: "object",
            properties: {
              username: {
                type: "string"
              },
              email: {
                type: "string"
              },
              password: {
                type: "string"
              }
            }
          },
          Login: {
            type: "object",
            properties: {
              email: {
                type: "string"
              },
              password: {
                type: "string"
              }
            }
          },
          Profile: {
            type: "object",
            properties: {
              username: {
                type: "string"
              },
              email: {
                type: "string"
              }
            }
          }
        },
      },
    });
  });
}
