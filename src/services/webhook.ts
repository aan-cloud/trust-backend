import Stripe from "stripe";
import stripe from "../libs/stripe";
import prisma from "../libs/db";

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;

export const webhookFunction = async (body: string, signature: string) => {
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    if (!event) throw Error("Invalid signature");

    switch(event.type) {

        case "checkout.session.async_payment_succeeded": {
            const paymentSession = event.data.object as Stripe.Checkout.Session

            await prisma.transaction.updateMany({
                where: { stripePaymentId: paymentSession.id },
                data: { status: "SUCCES"}
            })

            break
        }

        case "checkout.session.async_payment_failed": {
            const paymentSession = event.data.object as Stripe.Checkout.Session

            await prisma.transaction.updateMany({
                where: { stripePaymentId: paymentSession.id },
                data: { status: "FAILED"}
            })

            break
        }

        default:
            throw Error("Unhandled event Type")
    }

}