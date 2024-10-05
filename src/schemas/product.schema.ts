import { z } from "zod";

const productSchema = z.object({
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

export default productSchema;
