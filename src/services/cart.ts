import prisma from "../libs/db";

export const postToCart = async (productId: string, userId: string, sum: number) => {
    //check user and product for layer check
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!user) throw new Error("User not found");
    if (!product) throw new Error("Product not found");

    const existingCart = await prisma.cart.findFirst({
        where: { userId: user?.id },
        select: { id: true }
    });

    if (!existingCart) {
        throw new Error("User cart is null")
    }

    const cartId = existingCart.id;

    // CHECK IF PRODUCT IS EXIST IN CART ITEM
    const existingProductIncart = await prisma.cart.findFirst({
        where: { 
            id: cartId,
            userId: user?.id,
            items: {
                some: {
                    productId
                }
            }
        },
        select: {
            items: {
                select: {
                    id: true,
                    quantity: true,
                    productId: true,
                    cartId: true
                }
            },
            userId: true
        }
    });

    if (!existingProductIncart) {
        // post product to cartItem
        const productToCartItem = await prisma.cartItem.create({
            data: {
                productId,
                cartId,
                quantity: sum
            },
            select: {
                product: {
                    select: { name: true }
                },
                quantity: true
            }
        });

        return {
            message: "Success add product to cart",
            productName: productToCartItem.product.name,
            quantity: productToCartItem.quantity
        };
    }

    const updateProductQuantity = await prisma.cartItem.update({
        data: {
            quantity: sum + existingProductIncart.items[0].quantity
        },
        where: { id: existingProductIncart.items[0].id },
        select: {
            product: {
                select: { name: true }
            },
            quantity: true
        }
    });

    return {
        message: "Success update quantity product to cart",
        productName: updateProductQuantity.product.name,
        quantity: updateProductQuantity.quantity
    };
 
};

export const getUserCart = async (userId: string) => {
    //check user for layer check
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if(!user) {
        throw new Error("User not found!")
    };

    // get all cart include cartItem
    const cart = await prisma.cart.findFirst({
        where: { userId },
        include: {
            items: {
                include: {
                    product: {
                        include: {
                            imageUrl: true
                        }
                    }
                }
            }
        }
    });

    // get total price in cart
    const totalPrice = cart?.items.reduce((totalItem, currentItem) => totalItem + (currentItem.product.price * currentItem.quantity), 0);

    return {
        totalPrice,
        ...cart
    };
};


export const deleteCartItem = async (cartItemId: string, slug: string) => {
    const product = await prisma.product.findFirst({
        where: { slug }
    });

    if(!product) {
        throw new Error("Product not found");
    };

    const deletedProductInCartItem = await prisma.cartItem.delete({
        where: { id: cartItemId },
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