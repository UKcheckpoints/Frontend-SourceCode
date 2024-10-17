"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ForgotUsername() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Simulated backend response
            if (email === 'error@example.com') {
                throw new Error('Email not found')
            }

            setSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white to-sky-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-md p-6 sm:p-8"
            >
                <Link href="/user/signin" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                </Link>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-sans">Forgot Username</h2>
                <p className="text-gray-600 mb-6 font-inter">Enter your email address to recover your username.</p>

                {!success ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" font="sans">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full"
                                font="inter"
                            />
                        </div>
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <Alert variant="destructive">
                                        <XCircle className="h-4 w-4" />
                                        <AlertDescription font="inter">{error}</AlertDescription>
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-sans"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Recovering...
                                </>
                            ) : (
                                'Recover Username'
                            )}
                        </Button>
                    </form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                    >
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans">Username Sent!</h3>
                        <p className="text-gray-600 mb-6 font-inter">We&apos;ve sent your username to the email address provided.</p>
                        <Button asChild className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-sans">
                            <Link href="/user/signin">Return to Login</Link>
                        </Button>
                    </motion.div>
                )}

                <div className="mt-6 text-center">
                    <Link href="/user/forgot-password" className="text-sm font-medium text-sky-600 hover:text-sky-500 font-sans">
                        Forgot password instead?
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}