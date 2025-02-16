import { z } from "@hono/zod-openapi";

export const transactionIdParam = z.object({
    transactionId: z.string().openapi({
        param: {
            name: "transactionId",
            in: "path"
        },
        example: "ddwrw123"
    })
});