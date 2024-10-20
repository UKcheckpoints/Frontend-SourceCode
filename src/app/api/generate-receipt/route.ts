import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import PDFDocument from 'pdfkit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-09-30.acacia',
});

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
        return NextResponse.json({ error: 'Invalid or missing paymentId' }, { status: 400 });
    }

    try {
        const payment = await stripe.paymentIntents.retrieve(paymentId, {
            expand: ['payment_method', 'customer'],
        });

        const doc = new PDFDocument({ margin: 50 });

        const chunks: Uint8Array[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            const response = new NextResponse(pdfBuffer, {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename=receipt-${paymentId}.pdf`,
                },
            });
            return response;
        });

        doc.fontSize(25).text('UKcheckpoints', { align: 'center' });
        doc.moveDown();

        doc.fontSize(20).text('Payment Receipt', { align: 'center' });
        doc.moveDown();

        const details = [
            { label: 'Receipt Number:', value: payment.id },
            { label: 'Date:', value: new Date(payment.created * 1000).toLocaleDateString() },
            { label: 'Amount Paid:', value: `£${(payment.amount / 100).toFixed(2)}` },
            { label: 'Payment Method:', value: getPaymentMethodDetails(payment.payment_method) },
            { label: 'Status:', value: payment.status.toUpperCase() },
        ];

        details.forEach(({ label, value }) => {
            doc.fontSize(12)
                .text(label, { continued: true, width: 150 })
                .text(value || 'N/A');
            doc.moveDown(0.5);
        });

        doc.moveDown(2);
        doc.fontSize(10)
            .text('Thank you for choosing UKcheckpoints Premium!', { align: 'center' })
            .moveDown(0.5)
            .text('For support, contact: support@ukcheckpoints.com', { align: 'center' });

        doc.end();

    } catch (error: unknown) {
        console.error('Error generating receipt:', error);

        if (error instanceof Stripe.errors.StripeError) {
            return NextResponse.json({ error: `Stripe error: ${error.message}` }, { status: 500 });
        }

        return NextResponse.json({ error: 'Error generating receipt' }, { status: 500 });
    }
}

function getPaymentMethodDetails(paymentMethod: string | Stripe.PaymentMethod | null): string {
    if (typeof paymentMethod === 'string') {
        return paymentMethod;
    }
    if (paymentMethod && 'card' in paymentMethod && paymentMethod.card) {
        return `${paymentMethod.card.brand?.toUpperCase()} **** ${paymentMethod.card.last4}`;
    }
    return 'N/A';
}
