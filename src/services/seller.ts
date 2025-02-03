import prisma from "../libs/db";

export const getSellerDashboard = async (sellerId: string) => {
    const sellerProducts = await prisma.product.findMany({
        where: { userId: sellerId }
    });

    return sellerProducts;
}