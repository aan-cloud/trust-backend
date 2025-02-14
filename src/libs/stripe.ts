import Stripe from "stripe";

const stripeSk = process.env.STRIPE_SK as string;
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;
const stripe = new Stripe(stripeSk, { apiVersion: '2024-12-18.acacia'});

export function verifyStripeSignature(body: string, signature: string) {
    try {
      return stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed.', err);
      return null;
    }
}

export default stripe;