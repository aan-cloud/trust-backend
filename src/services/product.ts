import prisma from "../lib/db";
import { z } from "zod";
import productSchema from "../schemas/product";

type product = z.infer<typeof productSchema>;

export default class ProductServices {
  async getAllProduct() {
    return await prisma.products.findMany({});
  };

  async getProductName(slug: string) {
    return await prisma.products.findFirst({
      where: {
        slug: slug,
      },
    });
  };

  async deleteProductBySlug(slug: string) {
    return await prisma.products.delete({
      where: {
        slug: slug,
      },
    });
  };

  async postSeedProduct (data: product[]) {
    return await prisma.products.createMany({
      data: data,
      skipDuplicates: true
    });
  };

  async postProduct({
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
        category,
        stock,
        created_at,
        updated_at,
      },
    });
  };
};
