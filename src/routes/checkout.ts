import { OpenAPIHono } from "@hono/zod-openapi";

import * as checkoutServices from "../services/checkout"
import authMiddleware from "../middlewares/check-user-token";
import { Context } from "hono";

const checkoutRoute = new OpenAPIHono();

const TAGS = ["Checkout"];

checkoutRoute.openapi(
    {
        path: "/session",
        method: "post",
        tags: TAGS,
        summary: "Create checkout session",
        description: "Create checkout session and return redirect url",
        security: [{ AuthorizationBearer: [] }],
        middleware: [authMiddleware ],
        responses: {
            201: {
                description: "Create checkout session success",
            },
            400: {
                description: " failed",
            },
        },
    },
    async (c) => {
        const userId = (c as Context).get("user")?.id as string;

        try {
            const productToCart = await checkoutServices.createCheckoutSession(userId);
            return c.json(productToCart, 201);
        } catch (error: Error | any) {
            return c.json(error, 400)
        }
    }
);

export default checkoutRoute;