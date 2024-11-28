import prisma from "../libs/db";

export default class CategoriesServices {
    async getCategories() {
        return await prisma.category.findMany({
            include: {
                products: true,
            },
        });
    }

    async searchcategory(query: string) {
        return await prisma.category.findMany({
            where: {
                name: {
                    contains: query,
                    mode: "insensitive",
                },
            },
        });
    }

    async getCategoryBySlug(slug: string) {
        return await prisma.category.findUnique({
            where: { slug: slug },
            include: {
                products: true,
            },
        });
    }
}
