import { OpenAPIHono } from "@hono/zod-openapi"

import * as transactionService from "../services/transaction";
import * as transactionSchema from "../schemas/transaction"
import authMiddleware from "../middlewares/check-user-token";
import { Context } from "hono";

const transactionRoute = new OpenAPIHono();
const TAGS = ["Transaction"];

transactionRoute.openapi(
    {
        path: "/",
        method: "get",
        tags: TAGS,
        summary: "Get all user transaction",
        security: [{ AuthorizationBearer: [] }],
        middleware: [authMiddleware ],
        responses: {
            201: {
                description: "Get user transaction success",
            },
            400: {
                description: "Get user transaction failed",
            },
        },
    },
    async (c) => {
        const userId = (c as Context).get("user")?.id as string;
        
        try {
            const transactions = await transactionService.getUserTransactions(userId);

            return c.json(transactions, 200);
        } catch (error: Error | any) {
            return c.json(error, 400)
        }
    }
);

transactionRoute.openapi(
    {
        path: "/{transactionId}",
        method: "get",
        tags: TAGS,
        summary: "Get transaction details",
        description: "Get transaction details",
        security: [{ AuthorizationBearer: [] }],
        middleware: [authMiddleware ],
        request: {
            params: transactionSchema.transactionIdParam
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
        const { transactionId } = c.req.valid("param");
        const userId = (c as Context).get("user").id as string

        try {
            const productDetails = await transactionService.getUserTransactionDetials(userId ,transactionId);

            return c.json(productDetails, 200);
        } catch (error: Error | any) {
            return c.json(error, 400);
        }
    }
);

export default transactionRoute;