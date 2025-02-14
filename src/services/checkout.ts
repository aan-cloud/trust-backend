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
        metadata: {
            userId
        },
        success_url: 'https://trust.muhammad-farhan.com/success',
        cancel_url: 'https://trust.muhammad-farhan.com/cancel',
    });

    if (!session) {
        throw new Error("Checkout session failed")
    }

    await prisma.transaction.create({
        data: {
            userId,
            amount: session.amount_total! / 100,
            currency: session.currency!,
            stripePaymentId: session.id,
            status: "PENDING"
        }
    });

    return {
        sessionUrl: session.url
    }
}