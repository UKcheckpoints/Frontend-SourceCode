'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { MapIcon, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog"
import { Label } from "@/components/ui/Label"
import Link from 'next/link'
import { ForgotPasswordData, FormData } from '@/types/Auth'
import { useJwtValidator } from '@/lib/hooks/useJwtValidator'
import UserLoadingScreen from '@/components/layout/Loader'
import axios from 'axios';
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [IsLoading, setIsLoading] = useState(false)
    const [loginError, setLoginError] = useState<string | null>(null)
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
    const [forgotPasswordStatus, setForgotPasswordStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
    const { register: registerForgotPassword, handleSubmit: handleSubmitForgotPassword, formState: { errors: forgotPasswordErrors } } = useForm<ForgotPasswordData>()
    const router = useRouter();

    const { isLoadingState, isValid } = useJwtValidator();

    if (isLoadingState) {
        return <UserLoadingScreen />
    }

    if (isValid) {
        router.push('/map')
        return <UserLoadingScreen />
    }

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setLoginError(null);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
                username: data.username,
                password: data.password
            }, { withCredentials: true });

            if (response.status === 200) {
                const { token } = response.data;
                if (token.userData.role === "SUPER_ADMIN") {
                    router.push('/admin-dashbored')
                } else {
                    router.push('/map')
                }
                console.log('Login successful', token);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status === 422) {
                        setLoginError("Missing required fields. Please provide both username and password.");
                    } else if (error.response.status === 401) {
                        setLoginError("Invalid username or password.");
                    } else {
                        setLoginError("An unexpected error occurred. Please try again.");
                    }
                } else {
                    setLoginError("Network error. Please check your internet connection.");
                }
            } else {
                setLoginError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const onForgotPasswordSubmit = async (_data: ForgotPasswordData) => {
        setForgotPasswordStatus('loading')
        try {
            await new Promise(resolve => setTimeout(resolve, 2000))
            setForgotPasswordStatus('success')
        } catch {
            setForgotPasswordStatus('error')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg p-10 rounded-2xl shadow-2xl"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="flex justify-center mb-6"
                    >
                        <MapIcon className="h-20 w-20 text-sky-600" />
                    </motion.div>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-sm text-gray-600 mb-8">Sign in to access your account</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                        <Input
                            label="Username"
                            type="text"
                            autoComplete="username"
                            required
                            {...register("username")}
                            error={errors.username?.message}
                        />
                        <Input
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            required
                            {...register("password")}
                            error={errors.password?.message}
                            showPasswordToggle
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setForgotPasswordOpen(true)}
                            className="text-sm text-sky-600 hover:text-sky-500"
                        >
                            Forgot password?
                        </button>
                    </div>

                    <AnimatePresence>
                        {loginError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-500 text-sm mt-2 bg-red-100 p-3 rounded-md"
                            >
                                {loginError}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <Button
                            type="submit"
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                            disabled={IsLoading}
                        >
                            {IsLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="font-medium text-sky-600 hover:text-sky-500">
                            Create one now
                        </Link>
                    </p>
                </div>
            </motion.div>

            <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                <DialogContent className="bg-white rounded-lg shadow-xl transform transition-all ease-in-out duration-300">
                    <DialogHeader className="space-y-2">
                        <DialogTitle className="text-2xl font-bold text-gray-900">Forgot Password</DialogTitle>
                        <DialogDescription className="text-gray-500">
                            Enter your email address and we&apos;ll send you a link to reset your password.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitForgotPassword(onForgotPasswordSubmit)} className="mt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    {...registerForgotPassword("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />
                                {forgotPasswordErrors.email && (
                                    <p className="text-red-500 text-sm mt-1">{forgotPasswordErrors.email.message}</p>
                                )}
                            </div>
                            {forgotPasswordStatus === 'success' && (
                                <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-md">
                                    <CheckCircle className="mr-2 h-5 w-5" />
                                    <span className="text-sm">Password reset link sent to your email.</span>
                                </div>
                            )}
                            {forgotPasswordStatus === 'error' && (
                                <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-md">
                                    <XCircle className="mr-2 h-5 w-5" />
                                    <span className="text-sm">An error occurred. Please try again.</span>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="mt-6">
                            <Button
                                type="submit"
                                disabled={forgotPasswordStatus === 'loading'}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                {forgotPasswordStatus === 'loading' ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}