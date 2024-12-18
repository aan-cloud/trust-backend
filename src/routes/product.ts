import { OpenAPIHono } from "@hono/zod-openapi";

// import authMiddleware from "../middlewares/check-user-token";
// import { checkUserRole } from "../middlewares/check-user-role";

import * as productServices from "../services/product";
import * as productSchema from "../schemas/product.schema";
import { checkUserRole } from "../middlewares/check-user-role";
import authMiddleware from "../middlewares/check-user-token";

import { Context } from "hono";

const productRoute = new OpenAPIHono();

const TAGS = ["Products"];

productRoute.openapi(
    {
        path: "/",
        method: "get",
        tags: TAGS,
        summary: "Get all product list",
        request: {
            query: productSchema.querySchema
        },
        body: {
            request: {
                "application/json": {
                    content: {
                        schema: productSchema.default,
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Register success",
            },
            400: {
                description: "Register failed",
            },
        },
    },
    async (c) => {
        const { filter, sort } = c.req.valid("query");

        try {
            const products = await productServices.getAllProducts(filter, sort);

            return c.json(products, 200);
        } catch (error: Error | any) {
            return c.json(error, 400)
        }
    }
);

productRoute.openapi(
    {
        path: "/{slug}",
        method: "get",
        tags: TAGS,
        summary: "Place details",
        description: "Get product details by slug",
        request: {
            params: productSchema.slugParam
        },
        body: {
            request: {
                "application/json": {
                    content: {
                        schema: productSchema.default,
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Register success",
            },
            400: {
                description: "Register failed",
            },
        },
    },
    async (c) => {
        const { slug } = c.req.valid("param");

        try {
            const productDetails = await productServices.getDetailProduct(slug);

            return c.json(productDetails)
        } catch (error: Error | any) {
            return c.json(error, 400)
        }
    }
);

productRoute.openapi(
    {
        path: "/create",
        method: "post",
        tags: TAGS,
        summary: "Create Product",
        description: "Create product",
        security: [{ AuthorizationBearer: [] }],
        middleware: [authMiddleware, checkUserRole],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: productSchema.createProductSchema
                    }
                }
            }
        },
        responses: {
            201: {
                description: "Register success",
            },
            400: {
                description: "Register failed",
            },
        },
    },
    async (c) => {
        const reqBody = c.req.valid("json");
        const userId = (c as Context).get("user")?.id as string;
        console.info(reqBody)
        try {
            const createdProduct = await productServices.createProduct(reqBody, userId);
            console.log(createdProduct)
            return c.json(createdProduct, 201);
        } catch (error: Error | any) {
            return c.json(error, 400)
        }
    }
);

productRoute.openapi(
    {
        path: "/{productId}",
        method: "delete",
        tags: TAGS,
        summary: "Delete Product",
        description: "Delete Product by slug",
        security: [{ AuthorizationBearer: [] }],
        middleware: [authMiddleware, checkUserRole],
        request: {
            params: productSchema.productIdParam
        },
        body: {
            request: {
                "application/json": {
                    content: {
                        schema: productSchema.default,
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Register success",
            },
            400: {
                description: "Register failed",
            },
        },
    },
    async (c) => {
        const { productId } = c.req.valid("param");

        try {
            const deleteProduct = await productServices.deleteProduct(productId);

            return c.json({ ...deleteProduct, message: "Product deleted succuesfully" }, 204);
        } catch (error: Error | any) {
            return c.json(error, 409);
        }
    }
);

export default productRoute;
