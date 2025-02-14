import Stripe from "stripe";

const stripeSk = process.env.STRIPE_SK as string;
const stripe = new Stripe(stripeSk, { apiVersion: '2024-12-18.acacia'});

export default stripe;