import { z } from '@hono/zod-openapi'

const ProductSchema = z.object({
    id: z.string().min(4).optional(),
    name: z.string(),
    slug: z.string(),
    imageUrl: z.string(),
    description: z.string(),
    price: z.number(),
    stock: z.number(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    category: z.string(),
});

export const querySchema = z.object({
    filter: z.string().openapi({
        param: {
            name: "filter",
            in: "query"
        },
        example: "{slug: tire}"
    }).optional(),
    sort: z.string().openapi({
        param: {
            name: "sort",
            in: 'query'
        },
        example: "desc"
    }).optional()
});

export default ProductSchema;
