import prisma from "../src/libs/db";

import slugify from "../src/utils/slugify";

import { dataProducts } from "./data/products";

async function main(userName: string) {

    const user = await prisma.user.findUnique({
        where: {
            userName
        }
    });

    console.info(user?.userName)

    if (!user) {
        throw new Error("User seeder not has access!");
    };

    for (const product of dataProducts) {

        const productData = {
            slug: slugify(product.name),
            publish: false,
            userId: user.id,
            ...product
        };

        const newProductResult = await prisma.product.upsert({
            where: { name: product.name },
            update: productData,
            create: productData,
        });

        console.info(`🆕 Product: ${newProductResult.name}`);
    }
}

main(process.env.USER_ADMIN as string)
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
