import { OpenAPIHono } from "@hono/zod-openapi";
import { webhookFunction } from "../services/webhook";

const webHookRoutes = new OpenAPIHono();
const TAGS = ["Webhooks"];

webHookRoutes.openapi(
    {
        path: "/create",
        method: "post",
        tags: TAGS,
        summary: "Create Stripe Webhook",
        description: "This endpoint not for consuming directly",
        request: {
            body: {
                content: {
                    "text/plain": {
                        schema: {
                            type: "string"
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
                description: "Add product success",
            },
            400: {
                description: "Add product failed",
            },
        },
    },
    async (c) => {
        const body = await c.req.text();
        const header= c.req.header("stripe-signature");

        try {
            await webhookFunction(body, header!);

            return c.json({ message: "Succes exe webhook" }, 201);
        } catch (error: Error | any ) {
            return c.json(error, 401);
        }

    }
);