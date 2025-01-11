import prisma from "../libs/db";
import { z } from "zod";
import ProductSchema from "../schemas/product.schema";
import parseFilters from "../utils/filter";
import parseSorts from "../utils/sort";
import slugify from "../utils/slugify";

type Product = z.infer<typeof ProductSchema>;
// Refactor, only publish product can display
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
            category: {
                select: { name: true }
            },
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
        },
    });

    if (!data) {
        throw new Error("Product not found!!")
    }

    return data;
};

export const createProduct = async (dataProduct: Product, id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new Error("Access data danied, Please login or register first");
    }

    const category = await prisma.category.findUnique({
        where: { name: dataProduct.category }
    });

    if (!category) {
        throw new Error("Category must be added")
    }

    const parseSlug = slugify(dataProduct.name);

    const generateProductData = await prisma.product.create({
        data: {
            name: dataProduct.name,
            slug: parseSlug,
            description: dataProduct.description,
            price: dataProduct.price,
            categoryId: category.id,
            stock: dataProduct.stock,
            imageUrl: {
                create: {
                    imageUrl: dataProduct.imageUrl,
                },
            },
            publish: false,
            userId: user.id,
        },
    });

    return generateProductData;
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


export const publishedProduct = async (productId: string) => {
    const checkProduct = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!checkProduct) {
        throw new Error("Incorrect Product ID !!");
    };

    const publishProduct = await prisma.product.update({
        data: {
            publish: true
        },
        where: { id: productId }
    });

    return publishProduct;
}