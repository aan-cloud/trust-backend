import prisma from "../libs/db";

export const postToWishList = async (productId: string, userId: string) => {
    //check user and product for layer check
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if(!user && !product) {
        if (!user) { throw new Error("User not found") } else { throw new Error("Product not found") }
    };

    // create cart using userId
    const newWishList = await prisma.wishList.create({
        data: {
            userId
        }
    });

    // post product to cartItem
    const productToWishLishItem = await prisma.wishListItem.create({
        data: {
            productId,
            wishListId: newWishList.id
        },
        select: {
            product: {
                select: { name: true }
            }
        }
    });

    return {
        message: "Success add product to wishlist",
        productName: productToWishLishItem.product.name
    };
};

export const getUserWishList = async (userId: string) => {
    //check user for layer check
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if(!user) {
        throw new Error("User not found!")
    };

    // get all cart include cartItem
    const wishList = await prisma.wishList.findFirst({
        where: { userId },
        include: {
            wishList:{
                include: {
                    product: true
                }
            }
        }
    });

    return wishList;
};


export const deleteWishListItem = async (wishListItemId: string, productId: string) => {
    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if(!product) {
        throw new Error("Product not found");
    };

    const deletedProductInCartItem = await prisma.wishListItem.delete({
        where: { id: wishListItemId },
        select: {
            product: {
                select: { name: true }
            }
        }
    });

    return {
        message: "Success delete product",
        productName: deletedProductInCartItem.product.name
    };
};