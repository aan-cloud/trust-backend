import Stripe from "stripe";
import stripe from "../libs/stripe";
import prisma from "../libs/db";
import { deleteCartItem } from "./cart";

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;

export const webhookFunction = async (body: string, signature: string) => {
    let event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
        console.log('Received webhook event:', event.type);
    } catch (err: any) {
        console.error("Webhook verification failed", err.message);
        throw new Error(`Webhook verification failed: ${err.message}`);
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const paymentSession = event.data.object as Stripe.Checkout.Session;
                console.log('Processing completed session:', paymentSession.id);

                // Update transaction status
                await prisma.transaction.updateMany({
                    where: { stripePaymentId: paymentSession.id },
                    data: { 
                        status: "SUCCESS",
                        updatedAt: new Date()
                    }
                });
                console.log('Transaction updated to SUCCESS');

                // Get user cart
                const userCart = await prisma.cart.findFirst({
                    where: { userId: paymentSession.metadata?.userId },
                    select: {
                        items: {
                            select: {
                                id: true,
                                product: true
                            }
                        },
                    },
                });

                if (!userCart) {
                    console.warn('No cart found for user:', paymentSession.metadata?.userId);
                    return { received: true, warning: "No cart found to clear" };
                }

                // Delete cart items properly
                await Promise.all(
                    userCart.items.map(item => 
                        deleteCartItem(item.id, item.product.slug)
                    )
                );
                console.log('Cart items deleted successfully');

                return { received: true, status: "SUCCESS" };
            }

            case "checkout.session.expired": {
                const paymentSession = event.data.object as Stripe.Checkout.Session;
                console.log('Processing expired session:', paymentSession.id);

                await prisma.transaction.updateMany({
                    where: { stripePaymentId: paymentSession.id },
                    data: { 
                        status: "FAILED",
                        updatedAt: new Date()
                    }
                });
                console.log('Transaction updated to FAILED');

                return { received: true, status: "FAILED" };
            }

            default: {
                console.log(`Unhandled event type: ${event.type}`);
                return { received: true, status: "UNHANDLED" };
            }
        }
    } catch (err: any) {
        console.error('Error processing webhook:', {
            error: err.message,
            eventType: event.type,
            stack: err.stack
        });
        
        // Re-throw error to be handled by route handler
        throw new Error(`Failed to process webhook: ${err.message}`);
    }
};