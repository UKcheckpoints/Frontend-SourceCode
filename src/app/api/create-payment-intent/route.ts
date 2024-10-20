import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-09-30.acacia',
});

export async function POST(req: NextRequest) {
    try {
        const { amount } = await req.json() as { amount: number };

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'gbp',
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });
    } catch (err: unknown) {
        if (err instanceof Stripe.errors.StripeError) {
            return NextResponse.json({ statusCode: 500, message: err.message }, { status: 500 });
        }
        return NextResponse.json({ statusCode: 500, message: 'An unknown error occurred' }, { status: 500 });
    }
}
