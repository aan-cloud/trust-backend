import prisma from "../libs/db";

export const getAllSeller = async () => {
    const sellers = await prisma.user.findMany({
        where: {
            roles: {
                some: {
                    role: {
                        roleName: { equals: "SELLER" }
                    }
                }
            }
        }
    });

    if (!sellers) {
        throw new Error("Have no sellers!")
    }

    return sellers;
}

export const getSellerDashboard = async (sellerId: string) => {
    const sellerProducts = await prisma.product.findMany({
        where: { userId: sellerId },
        include: {
            imageUrl: true
        }
    });

    return sellerProducts;
}