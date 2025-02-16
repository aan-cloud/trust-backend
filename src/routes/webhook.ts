import { OpenAPIHono } from "@hono/zod-openapi";
import { webhookFunction } from "../services/webhook";
import rawBodyMiddleware from "../middlewares/raw-body";
import { Context } from "hono";

const webHookRoutes = new OpenAPIHono();
const TAGS = ["Webhooks"];

webHookRoutes.openapi(
    {
        path: "/",
        method: "post",
        tags: TAGS,
        summary: "Create Stripe Webhook",
        description: "This endpoint not for consuming directly",
        middleware: [rawBodyMiddleware],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object"
                        }
                    }
                }
            },
        },
        parameters: [
            {
                in: "header",
                name: "stripe-signature",
                description: "Stripe signature for webhook verification",
                required: true,
                schema: {
                    type: "string"
                }
            }
        ],
        responses: {
            201: {
                description: "Transaction webhook succesfully",
            },
            400: {
                description: "Transaction webhook failed",
            },
        },
    },
    async (c) => {
        const body =  (c as Context).get("rawBody");
        console.log("body: " + body)
        const header = c.req.header("stripe-signature");
        console.log(header)

        if (!header) {
            console.error("Missing stripe-signature header");
            return c.json(
                { 
                    error: "Missing stripe-signature header",
                    type: "missing_signature" 
                }, 
                400
            );
        }

        try {
            const webhookTransaction = await webhookFunction(body, header!);
            console.log(webhookTransaction)
            return c.json( webhookTransaction, 200);
        } catch (error: Error | any ) {
            console.log("webhook gagal")
            return c.json({ error: error.message }, 400);
        }

    }
);

export default webHookRoutes;