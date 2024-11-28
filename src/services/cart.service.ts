import prisma from "../libs/db";

export default class CartService {
    async newCart(user: any) {
        return await prisma.cart.create({
            data: { userId: user.id },
            include: { items: { include: { product: true } } },
        });
    }

    async existingCart(user: any) {
        return await prisma.cart.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            include: { items: true },
        });
    }

    async updateCart(user: any) {
        await prisma.cart.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            include: { items: true },
        });
    }
}
