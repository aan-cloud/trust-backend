import { z } from "zod";

const productSchema = z.object({
  id: z.string().min(4).optional(),
  name: z.string(),
  slug: z.string(),
  image_url: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  stock: z.number(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export default productSchema;
