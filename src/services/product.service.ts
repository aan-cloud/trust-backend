import prisma from "../lib/db";
import { z } from "zod";
import productSchema from "../schemas/product.schema";

type product = z.infer<typeof productSchema>;

export default class ProductServices {
  async getAllProducts() {
    return await prisma.products.findMany({});
  }

  async getProductsSlug(slug: string) {
    return await prisma.products.findFirst({
      where: {
        slug: slug,
      },
    });
  }

  async searchProduct(query: string) {
    return await prisma.products.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    });
  }

  async deleteAllProducts() {
    return await prisma.products.deleteMany({});
  }

  async deleteProductsBySlug(slug: string) {
    return await prisma.products.delete({
      where: {
        slug: slug,
      },
    });
  }

  async postProducts({
    name,
    slug,
    image_url,
    description,
    price,
    category,
    stock,
    created_at,
    updated_at,
  }: product) {
    return await prisma.products.create({
      data: {
        name,
        slug,
        image_url,
        description,
        price,
        stock,
        created_at,
        updated_at,
        category: {
          connect: {
            slug: category,
          },
        },
      },
    });
  }
}
