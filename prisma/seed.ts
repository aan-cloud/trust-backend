import prisma from "../src/libs/db";
import slugify from "../src/utils/slugify";
import { dataProducts } from "./data/products";
import { dataCategories } from "./data/categories";


async function imageUploader(productId:string, images: string[]) {
    images.forEach(async (image) => {
        const dataImage = {
            imageUrl: image,
            productId
        };

        const newImage = await prisma.image.upsert({
            create: dataImage,
            update: dataImage,
            where: { imageUrl: image }
        });
    
        console.log(`🖼 Image ${newImage.imageUrl}`)
    })
};

async function main(userName: string) {

    const user = await prisma.user.findUnique({
        where: {
            userName
        }
    });

    if (!user) {
        throw new Error("User seeder not has access!");
    };

    for (const category of dataCategories ) {

        const categoryData = {
            name: category.name
        };

        const newCategory = await prisma.category.upsert({
            create: categoryData,
            update: categoryData,
            where: categoryData,
        });

        console.log(`🔱 Category ${newCategory.name}`)
    }

    for (const product of dataProducts) {

        const category = await prisma.category.findUnique({
            where: { name: product.category }
        });

        if (!category) {
            throw new Error("Category must be added")
        }

        const productData = {
            slug: slugify(product.name),
            publish: true,
            userId: user.id,
            categoryId: category.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock
        };

        const newProductResult = await prisma.product.upsert({
            where: { name: product.name },
            update: productData,
            create: productData,
        });

        imageUploader(newProductResult.id, product.images)

        console.info(`🆕 Product: ${newProductResult.name} Category ${category.name}`);
    }
};

main(process.env.USER_ADMIN as string)
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
