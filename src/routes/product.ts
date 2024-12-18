/* eslint-disable @typescript-eslint/no-unused-vars */
import { OpenAPIHono } from "@hono/zod-openapi";

import authMiddleware from "../middlewares/check-user-token";
import { checkUserRole } from "../middlewares/check-user-role";

import * as produductServices from "../services/product";
import * as productSchema from "../schemas/product.schema";
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
            const products = await produductServices.getAllProducts(filter, sort);

            return c.json(products, 200);
        } catch (error: Error | any) {
            return c.json(error, 400)
        }
    }
);

export default productRoute;
