import prisma from "../libs/db";

export const postToCart = async (productId: string, userId: string, sum: number) => {
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

    const existingCart = await prisma.cart.findFirst({
        where: { userId },
        select: { id: true }
    });

    let cartId;
    if (!existingCart) {
        const newCart = await prisma.cart.create({
            data: { userId },
            select: { id: true }
        });
            cartId = newCart.id;
    } else {
        cartId = existingCart.id;
    }

    // CHECK IF PRODUCT IS EXIST IN CART ITEM
    const existingProductIncart = await prisma.cartItem.findFirst({
        where: { productId }
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
            quantity: sum + existingProductIncart.quantity
        },
        where: { id: existingProductIncart.id },
        select: {
            product: {
                select: { name: true }
            },
            quantity: true
        }
    });

    return {
        message: "Success add product to cart",
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