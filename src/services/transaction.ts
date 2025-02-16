import prisma from "../libs/db";

export const getUserTransactions = async (userId: string) => {

    const userTransactionHistory = await prisma.transaction.findMany({
        where: { userId },
        select: {
            createdAt: true,
            updatedAt: true,
            status: true,
            currency: true,
            userId: true,
            id: true
        }
    });

    return { userTransactionHistory }
};

export const getUserTransactionDetials = async (userId: string , transactionId: string) => {

    const userTransactionDetails = await prisma.transaction.findUnique({
        where: { id: transactionId, userId },
        select: {
            createdAt: true,
            updatedAt: true,
            status: true,
            currency: true,
            userId: true,
            id: true,
            amount: true,
            items: true
        }
    });

    if (!userTransactionDetails) {
        throw new Error("User transaction details not found")
    }

    return userTransactionDetails
}

export const createTransactionItem = async (userId: string, transactionId: string, productId: string) => {
    // double checked
    const checkUser = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!checkUser) {
        throw new Error("You're not authorize")
    }

    // check transaction
    const userTransaction = await prisma.transaction.findUnique({
        where: { id: transactionId }
    });


    if (!userTransaction) {
        throw new Error("You don't have any transaction")
    }

    // check product

    const product = await prisma.product.findUnique({
        where: { id: productId }
    });


    if (!product) {
        throw new Error("Product not found")
    }

    const transactionItem = await prisma.transactionItem.create({
        data: {
            transactionId,
            productId
        }
    });

    return transactionItem
}