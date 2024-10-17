"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function ForgotPassword() {
    const [username, setUsername] = useState('')
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
            if (username === 'error') {
                throw new Error('Username not found')
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-sans">Forgot Password</h2>
                <p className="text-gray-600 mb-6 font-inter">Enter your username to reset your password.</p>

                {!success ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" font="sans">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                                        <AlertTitle font="sans">Error</AlertTitle>
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
                                    Resetting...
                                </>
                            ) : (
                                'Reset Password'
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans">Password Reset Sent!</h3>
                        <p className="text-gray-600 mb-6 font-inter">We've sent a password reset link to the email associated with your account.</p>
                        <Button asChild className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-sans">
                            <Link href="/user/signin">Return to Login</Link>
                        </Button>
                    </motion.div>
                )}

                <div className="mt-6 text-center">
                    <Link href="/user/forgot-username" className="text-sm font-medium text-sky-600 hover:text-sky-500 font-sans">
                        Forgot username instead?
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}