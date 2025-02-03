import { z } from "@hono/zod-openapi";

export const sellerIdParam = z.object({
    sellerId: z.string().openapi({
        param: {
            name: "sellerId",
            in: "path"
        },
        example: "123e34er"
    })
});