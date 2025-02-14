import Stripe from "stripe";
import stripe from "../libs/stripe";
import prisma from "../libs/db";

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;

export const webhookFunction = async (body: string, signature: string) => {
    let event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err: any) {
        throw new Error(`Webhook verification failed: ${err.message}`);
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const paymentSession = event.data.object as Stripe.Checkout.Session;

            try {
                await prisma.transaction.updateMany({
                    where: { stripePaymentId: paymentSession.id },
                    data: { status: "SUCCESS" }
                });
            } catch (err) {
                console.error("Database update failed:", err);
            }
            break;
        }

        case "checkout.session.expired": {
            const paymentSession = event.data.object as Stripe.Checkout.Session;

            try {
                await prisma.transaction.updateMany({
                    where: { stripePaymentId: paymentSession.id },
                    data: { status: "FAILED" }
                });
            } catch (err) {
                console.error("Database update failed:", err);
            }
            break;
        }

        default:
            console.warn(`Unhandled event type: ${event.type}`);
            break;
    }
};
