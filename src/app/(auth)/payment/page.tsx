'use client';

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js'
import { ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { loadStripe } from '@stripe/stripe-js';
import { subscriptionTier } from '@/constants/layout/Payment';

function ModernPaymentUI() {
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [paymentError, setPaymentError] = useState<string | null>(null)
    const [email, setEmail] = useState<string>('')
    const stripe = useStripe()
    const elements = useElements()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setIsProcessing(true)
        setPaymentError(null)

        const cardElement = elements.getElement(CardElement)

        if (cardElement) {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            })

            if (error) {
                setPaymentError(error.message ?? 'An unknown error occurred')
                setIsProcessing(false)
            } else {
                // Here you would typically send the paymentMethod.id to your server
                console.log('Payment successful:', paymentMethod)
                setIsProcessing(false)
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl bg-white shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-sky-500 text-white p-8">
                    <CardTitle className="text-4xl font-bold">UKcheckpoints Premium</CardTitle>
                    <CardDescription className="text-sky-100 text-xl mt-2">
                        Optimize your routes and save time with our premium service
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-2xl font-semibold mb-4 text-sky-800">Premium Features</h3>
                            <ul className="space-y-4">
                                {subscriptionTier.features.map((feature, index) => (
                                    <motion.li
                                        key={index}
                                        className="flex items-center space-x-3"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="flex-shrink-0">{feature.icon}</div>
                                        <span className="text-gray-700">{feature.text}</span>
                                    </motion.li>
                                ))}
                            </ul>
                            <div className="mt-6">
                                <span className="text-3xl font-bold text-sky-600">£{subscriptionTier.price}</span>
                                <span className="text-gray-600 ml-2">per year</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-4 text-sky-800">Payment Details</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="card-element">Card Details</Label>
                                    <div className="mt-1 p-3 border rounded-md bg-gray-50">
                                        <CardElement
                                            options={{
                                                style: {
                                                    base: {
                                                        fontSize: '16px',
                                                        color: '#424770',
                                                        '::placeholder': {
                                                            color: '#aab7c4',
                                                        },
                                                    },
                                                    invalid: {
                                                        color: '#9e2146',
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {paymentError && (
                                        <motion.div
                                            className="text-red-500 text-sm"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            {paymentError}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <Button
                                    type="submit"
                                    disabled={isProcessing || !stripe}
                                    className="w-full bg-sky-500 hover:bg-sky-600 text-white text-lg py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    {isProcessing ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            Subscribe Now <ArrowRight className="ml-2 h-5 w-5" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-sky-50 p-6 flex justify-center">
                    <p className="text-sky-800 text-sm">
                        By subscribing, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default function App() {
    const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!);

    return (
        <>
            <Elements stripe={stripePromise}>
                <ModernPaymentUI />
            </Elements>
        </>
    )
}