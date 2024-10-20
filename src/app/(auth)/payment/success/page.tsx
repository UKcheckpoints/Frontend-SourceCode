'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Download, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { useRouter, useSearchParams } from 'next/navigation';

interface PaymentData {
    id: string;
    amount: number;
    created: number;
    paymentMethod: {
        card: {
            brand: string;
            last4: string;
        };
    };
    receipt_email: string;
}

export default function PaymentSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            const paymentIntentId = searchParams?.get('payment_intent');
            if (!paymentIntentId) {
                router.push('/');
                return;
            }

            try {
                const response = await fetch(`/api/get-payment-details?paymentIntentId=${paymentIntentId}`);
                if (!response.ok) throw new Error('Payment details not found');
                const data = await response.json();
                setPaymentData(data);
            } catch (error) {
                console.error('Error fetching payment details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentDetails();
    }, [searchParams, router]);

    const handleDownloadReceipt = async () => {
        if (!paymentData?.id) return;
        try {
            const response = await fetch(`/api/generate-receipt?paymentId=${paymentData.id}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `receipt-${paymentData.id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading receipt:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-sky-500 rounded-full border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-4">
            <Card className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
                <CardHeader className="bg-sky-500 text-white p-6 md:p-10 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-sky-600 opacity-90"></div>
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="relative z-10 mx-auto mb-6 h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-lg"
                    >
                        <Check className="h-10 w-10 text-sky-500" />
                    </motion.div>
                    <CardTitle className="text-3xl md:text-4xl font-bold relative z-10">Payment Successful!</CardTitle>
                </CardHeader>

                <CardContent className="p-6 md:p-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-8"
                    >
                        <div className="text-center">
                            <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
                                Welcome to UKcheckpoints Premium!
                            </h3>
                            <p className="text-gray-600 text-lg">Your journey to optimized routes begins now</p>
                        </div>

                        <div className="bg-sky-50 rounded-2xl p-6 md:p-8 space-y-4 shadow-inner">
                            {[
                                { label: "Order ID", value: `#${paymentData?.id || 'N/A'}` },
                                { label: "Amount Paid", value: `£${((paymentData?.amount || 0) / 100).toFixed(2)}` },
                                { label: "Payment Method", value: `${paymentData?.paymentMethod?.card?.brand || 'Card'} ****${paymentData?.paymentMethod?.card?.last4 || '****'}` },
                                { label: "Date", value: paymentData?.created ? new Date(paymentData.created * 1000).toLocaleDateString() : 'N/A' },
                                { label: "Receipt Email", value: paymentData?.receipt_email || 'N/A' }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="flex flex-col md:flex-row md:items-center md:justify-between py-2 border-b border-sky-100 last:border-0"
                                >
                                    <span className="text-gray-600 font-medium mb-1 md:mb-0">{item.label}</span>
                                    <span className="text-sky-700 font-semibold">{item.value}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </CardContent>

                <CardFooter className="p-6 md:p-8 flex flex-col sm:flex-row gap-4 justify-center bg-sky-50">
                    <Button
                        onClick={() => router.push('/map')}
                        className="bg-sky-500 hover:bg-sky-600 transform hover:scale-105 transition-all duration-300 min-w-[160px]"
                    >
                        <MapPin className="mr-2 h-4 w-4" /> Go to Map
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleDownloadReceipt}
                        className="flex items-center gap-2 border-sky-500 text-sky-500 hover:bg-sky-50 transform hover:scale-105 transition-all duration-300 min-w-[160px]"
                    >
                        <Download className="h-4 w-4" /> Download Receipt
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}