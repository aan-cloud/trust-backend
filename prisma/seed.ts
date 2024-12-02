import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { dataCategories } from "./data/categories";
import { dataProducts } from "./data/products";

async function main() {
    for (const category of dataCategories) {
        const newCategoryResult = await prisma.category.upsert({
            where: { slug: category.slug },
            update: category,
            create: category,
        });
        console.info(`🆕 Category: ${newCategoryResult.name}`);
    }

    for (const product of dataProducts) {
        const {...productWithoutCategory } = product;

        const productData = {
            ...productWithoutCategory,
            category: { connect: { slug: product.category } },
        };

        const newProductResult = await prisma.product.upsert({
            where: { slug: product.slug },
            update: productData,
            create: productData,
        });

        console.info(`🆕 Product: ${newProductResult.name}`);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
