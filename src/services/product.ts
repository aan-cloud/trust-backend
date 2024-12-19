import prisma from "../libs/db";
import { z } from "zod";
import ProductSchema from "../schemas/product.schema";
import parseFilters from "../utils/filter";
import parseSorts from "../utils/sort";
import slugify from "../utils/slugify";

type Product = z.infer<typeof ProductSchema>;

export const getAllProducts = async (filter?: string, sort?: string) => {
    const where = parseFilters(filter);
    const orderBy = parseSorts(sort);

    const data = await prisma.product.findMany({
        where,
        orderBy,
        select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            price: true,
            slug: true,
            stock: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return data;
};

export const getDetailProduct = async (slug: string, publish: boolean = true) => {
    const data = await prisma.product.findFirst({
        where: { slug, publish },
        select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            price: true,
            slug: true,
            stock: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            cartItems: true,
        },
    });

    if (!data) {
        throw new Error("Product not found!!")
    }

    return data;
};

export const createProduct = async (dataProduct: Product, id: string) => {
    const userId = await prisma.user.findUnique({
        where: { id },
    });

    if (!userId) {
        throw new Error("Access data danied, Please login or register first");
    }

    const parseSlug = slugify(dataProduct.name);

    const generateData = await prisma.product.create({
        data: {
            name: dataProduct.name,
            slug: parseSlug,
            description: dataProduct.description,
            price: dataProduct.price,
            stock: dataProduct.stock,
            imageUrl: {
                create: {
                    imageUrl: dataProduct.imageUrl,
                },
            },
            publish: false,
            userId: userId.id,
        },
    });

    return generateData;
};

export const deleteProduct = async (productId: string) => {
    const getProduct = await prisma.product.delete({
        where: { id: productId },
    });

    if (!getProduct) {
        throw new Error(
            "Invalid product id, Please enter the product id correctly"
        );
    }

    return getProduct;
};
