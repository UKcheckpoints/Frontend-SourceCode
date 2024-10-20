import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-09-30.acacia',
});

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { paymentIntentId } = req.query;

    try {
        if (!paymentIntentId || typeof paymentIntentId !== 'string') {
            return res.status(400).json({ error: 'Invalid paymentIntentId' });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
            expand: ['payment_method'],
        });

        return res.status(200).json(paymentIntent);
    } catch (error: unknown) {
        if (error instanceof Stripe.errors.StripeError) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(500).json({ error: 'Error fetching payment details' });
    }
}
