import { z } from '@hono/zod-openapi'

const images = z.object({
    imageUrl: z.string().openapi({
        example: "https://...com"
    })
})

const ProductSchema = z.object({
    id: z.string().min(4).openapi({
        example: ""
    }).optional(),
    name: z.string().openapi({
        example: "Brake pedal"
    }),
    slug: z.string().openapi({
        example: ""
    }).optional(),
    imageUrl: z.array(images),
    description: z.string().openapi({
        example: "Very good quality"
    }),
    price: z.number().openapi({
        example: 200
    }),
    stock: z.number().openapi({
        example: 10
    }),
    category: z.string().openapi({
        example: ""
    }),
    createdAt: z.date().openapi({
        example: ""
    }).optional(),
    updatedAt: z.date().openapi({
        example: ""
    }).optional(),
});

export const createProductSchema = z.object({
    name: z.string().openapi({
        example: "Brake pedal"
    }),
    imageUrl: z.array(images),
    description: z.string().openapi({
        example: "Very good quality"
    }),
    price: z.number().openapi({
        example: 200
    }),
    stock: z.number().openapi({
        example: 10
    }),
    category: z.string().openapi({
        example: "tire"
    })
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
        example: "{name: asc}"
    }).optional()
});

export const slugParam = z.object({
    slug: z.string().openapi({
        param: {
            name: "slug",
            in: "path"
        },
        example: "toyota"
    }),
});

export const productIdParam = z.object({
    productId: z.string().openapi({
        param: {
            name: "productId",
            in: "path"
        },
        example: "product id"
    })
});

export const cartIdParam = z.object({
    itemId: z.string().openapi({
        param: {
            name: "cartItemId",
            in: "path"
        },
        example: "123"
    })
})

export default ProductSchema;
