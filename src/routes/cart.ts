import { OpenAPIHono } from "@hono/zod-openapi";

import * as cartServices from "../services/cart"
import * as cartSchema from "../schemas/cart";
import * as productSchema from "../schemas/product";
import authMiddleware from "../middlewares/check-user-token";
import { Context } from "hono";

const cartRoute = new OpenAPIHono();

const TAGS = ["Cart"];

cartRoute.openapi(
    {
        path: "/{productId}",
        method: "post",
        tags: TAGS,
        summary: "Insert product to cart",
        description: "Insert product to cart",
        security: [{ AuthorizationBearer: [] }],
        middleware: [authMiddleware ],
        request: {
            params: productSchema.productIdParam,
            body: {
                content: {
                    "application/json": {
                        schema: cartSchema.sumOfProduct
                    }
                }
            },
        },
        responses: {
            201: {
                description: "Add product success",
            },
            400: {
                description: "Add product failed",
            },
        },
    },
    async (c) => {
        const { productId } = c.req.valid("param");
        const { sum } = c.req.valid("json");
        const userId = (c as Context).get("user")?.id as string;

        try {
            const productToCart = await cartServices.postToCart(productId, userId, sum);
            return c.json(productToCart, 201);
        } catch (error: Error | any) {
            return c.json(error, 400)
        }
    }
);

cartRoute.openapi(
    {
        path: "/",
        method: "get",
        tags: TAGS,
        summary: "User cart",
        description: "Get user cart",
        security: [{ AuthorizationBearer: [] }],
        middleware: [ authMiddleware ],
        responses: {
            200: {
                description: "Get cart success",
            },
            400: {
                description: "Get cart failed",
            },
        },
    },
    async (c) => {
        const userId = (c as Context).get("user")?.id as string;
    
        try {
            const userCart = await cartServices.getUserCart(userId);
    
            return c.json(userCart, 200)
        } catch (error: Error | any) {
            return c.json(error, 400)
        }
    }
);

cartRoute.openapi(
    {
        path: "/{slug}",
        method: "post",
        tags: TAGS,
        summary: "Delete Product in cart",
        description: "Delete Product in cart using cart item",
        security: [{ AuthorizationBearer: [] }],
        middleware: [authMiddleware ],
        request: {
            params: productSchema.slugParam,
            body: {
                content: {
                    "application/json": {
                        schema: cartSchema.productToCartSchema
                    }
                }
            },
        },
        responses: {
            201: {
                description: "Delete item success",
            },
            400: {
                description: "Delete item failed",
            },
        },
    },
    async (c) => {
        const { slug } = c.req.valid("param");
        const { cartItemId } = c.req.valid("json");

        try {
            const deleteProduct = await cartServices.deleteCartItem(cartItemId, slug);

            return c.json(deleteProduct, 201);
        } catch (error: Error | any) {
            return c.json(error, 409);
        }
    }
);


export default cartRoute;