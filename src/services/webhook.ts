import Stripe from "stripe";
import stripe from "../libs/stripe";
import prisma from "../libs/db";

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;

export const webhookFunction = async (body: string, signature: string) => {
    let event;
    try {
        event = await stripe.webhooks.constructEventAsync(body, signature, endpointSecret);
        console.log('Received webhook event:', event.type);
    } catch (err: any) {
        console.error("Webhook verification failed", err.message)
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
            } catch (err: Error | any ) {
                return { received: false, error: err.message }
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
            } catch (err: Error | any ) {
                return { received: false, error: err.message }
            }
            break;
        }
    }

    return { received: true }
};
