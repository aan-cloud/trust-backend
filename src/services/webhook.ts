import Stripe from "stripe";
import prisma from "../libs/db";
import { verifyStripeSignature } from "../libs/stripe";

export const webhookFunction = async (body: string, signature: string) => {
    const event = verifyStripeSignature(body, signature);
    if (!event) throw Error("Invalid signature");

    switch(event.type) {
        case "payment_intent.created": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent
            const userId = paymentIntent.metadata.userId;

            if (!userId) throw new Error("Missing userId in metadata");

            await prisma.transaction.create({
                data: {
                    userId,
                    amount: paymentIntent.amount,
                    currency: paymentIntent.currency,
                    stripePaymentIntentId: paymentIntent.id
                }
            });

            break
        }

        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent

            await prisma.transaction.updateMany({
                where: { stripePaymentIntentId: paymentIntent.id },
                data: { status: "SUCCES"}
            })

            break
        }

        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent

            await prisma.transaction.updateMany({
                where: { stripePaymentIntentId: paymentIntent.id },
                data: { status: "FAILED"}
            })

            break
        }

        default:
            throw Error("Unandled event Type")
    }

}