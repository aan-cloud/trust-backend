import Stripe from "stripe";
import prisma from "../libs/db";

const stripe = new Stripe(process.env.STRIPE_SK as string);

export const createCheckoutSession = async (userId: string) => {
    const productToCheckout = await prisma.cart.findFirst({
        where: { userId },
        include: {
            items: {
                select: {
                    quantity: true,
                    product: {
                        include: {
                            imageUrl: true,
                        }
                    }
                }
            },
        }
    });

    if (!productToCheckout) {
        throw new Error("Products not found!")
    }

    const line_items = productToCheckout?.items.map((item) => ({
        price_data: {
          currency: 'myr',
          product_data: {
            name: item.product.name,
            images: item.product.imageUrl.map(url => url.imageUrl),
          },
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
    });

    return {
        sessionUrl: session.url
    }
}