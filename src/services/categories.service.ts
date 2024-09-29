import prisma from "../lib/db";

export default class CategoriesServices {
  async getCategories() {
    return await prisma.categories.findMany({
      include: {
        products: true,
      },
    });
  }

  async getCategoryBySlug(slug: string) {
    return await prisma.categories.findUnique({
      where: { slug: slug },
      include: {
        products: true,
      },
    });
  }
}
