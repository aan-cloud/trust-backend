import prisma from "../libs/db";
import { z } from "zod";
import productSchema from "../schemas/product.schema";

type product = z.infer<typeof productSchema>;

export default class ProductServices {
    async getAllProducts() {
        return await prisma.product.findMany({});
    }

    async getProductsSlug(slug: string) {
        return await prisma.product.findFirst({
            where: {
                slug: slug,
            },
        });
    }

    async searchProduct(query: string) {
        return await prisma.product.findMany({
            where: {
                name: {
                    contains: query,
                    mode: "insensitive",
                },
            },
        });
    }

    async deleteAllProducts() {
        return await prisma.product.deleteMany({});
    }

    async deleteProductsBySlug(slug: string) {
        return await prisma.product.delete({
            where: {
                slug: slug,
            },
        });
    }

    async postProducts({
        name,
        slug,
        imageUrl,
        description,
        price,
        category,
        stock,
        createdAt,
        updatedAt,
    }: product) {
        return await prisma.product.create({
            data: {
                name,
                slug,
                imageUrl,
                description,
                price,
                stock,
                createdAt,
                updatedAt,
                category: {
                    connect: {
                        slug: category,
                    },
                },
            },
        });
    }
}
