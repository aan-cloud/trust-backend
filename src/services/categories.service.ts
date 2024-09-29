import prisma from "../lib/db";

export default class CategoriesServices{
    async getCategories(category: string) {
        return await prisma.products.findMany({
            where: {
                category: category
            }
        });
    };

    async getCategiesSlug(slug: string) {
        return await prisma.products.findMany({
            where: {
                slug: slug
            }
        });
    };
};