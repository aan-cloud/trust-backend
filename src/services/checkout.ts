import Stripe from "stripe";
import prisma from "../libs/db";

const stripe = new Stripe(process.env.STRIPE_SK as string);

export const createCheckoutSession = async (userId: string) => {
    const productToCheckout = await prisma.cart.findFirst({
        where: { userId },
        include: {
            items: {
                select: {
                    product: true
                }
            },
        }
    });

    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'myr',
              product_data: {
                name: 'T-shirt',
              },
              unit_amount: 2000,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:4242/success',
        cancel_url: 'http://localhost:4242/cancel',
      });
}