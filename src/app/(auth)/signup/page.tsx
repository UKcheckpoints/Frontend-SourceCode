'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { MapIcon, Loader2, Bell, MapPin, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useForm } from "react-hook-form"
import Link from 'next/link'
import { Checkbox } from "@/components/ui/Checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog"
import { Label } from "@/components/ui/Label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { useJwtValidator } from '@/lib/hooks/useJwtValidator'
import UserLoadingScreen from '@/components/layout/Loader'
import axios from 'axios';
import { useRouter } from 'next/navigation'

interface SignupFormData {
    username: string
    email: string
    password: string
    confirmPassword: string
    acceptTerms: boolean
}

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [signupError, setSignupError] = useState<string | null>(null)
    const [showTerms, setShowTerms] = useState(false)

    const { register, handleSubmit, formState: { errors }, watch } = useForm<SignupFormData>()

    const { isLoadingState, isValid } = useJwtValidator();
    const router = useRouter();

    if (isLoadingState) {
        return <UserLoadingScreen />
    }

    if (isValid) {
        router.push('/map')
        return <UserLoadingScreen />
    }

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        setSignupError(null);

        try {
            if (!data.acceptTerms) {
                throw new Error("You must accept the terms and conditions");
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
                username: data.username,
                email: data.email,
                password: data.password
            });

            if (response.status === 201) {
                console.log(response.data.message);
                router.push('/login');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status === 409) {
                        setSignupError("Username or email already exists");
                    } else if (error.response.status === 400) {
                        setSignupError("Password must be at least 8 characters long");
                    } else {
                        setSignupError(error.response.data.message || "An unexpected error occurred");
                    }
                } else {
                    setSignupError("Network error. Please check your internet connection.");
                }
            } else {
                setSignupError(error instanceof Error ? error.message : "An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

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
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Create Account</h2>
                    <p className="text-sm text-gray-600 mb-8">Sign up to get started</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                        <Input
                            type="text"
                            autoComplete="username"
                            required
                            {...register("username", { required: "Username is required" })}
                            placeholder="Username"
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}

                        <Input
                            type="email"
                            autoComplete="email"
                            required
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            placeholder="Email"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}

                        <Input
                            type="password"
                            autoComplete="new-password"
                            required
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters long"
                                }
                            })}
                            placeholder="Password"
                            showPasswordToggle={true}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}

                        <Input
                            type="password"
                            autoComplete="new-password"
                            required
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (val: string) => {
                                    if (watch('password') != val) {
                                        return "Your passwords do not match";
                                    }
                                }
                            })}
                            placeholder="Confirm Password"
                            showPasswordToggle={true}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}

                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" {...register("acceptTerms", { required: true })} className='bg-white' />
                            <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                I accept the terms and conditions
                            </Label>
                        </div>
                        {errors.acceptTerms && <p className="text-red-500 text-xs mt-1">You must accept the terms and conditions</p>}

                        <Dialog open={showTerms} onOpenChange={setShowTerms}>
                            <DialogTrigger asChild>
                                <Button variant="link" className="text-sky-600 hover:text-sky-700 p-0">View Terms and Conditions</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-white">
                                <DialogHeader>
                                    <DialogTitle>Terms and Conditions</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <p className="text-sm text-gray-500">
                                        By accepting these terms, you agree to:
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-gray-500 space-y-2">
                                        <li>Allow us to access your location <MapPin className="inline-block w-4 h-4" /></li>
                                        <li>Receive push notifications <Bell className="inline-block w-4 h-4" /></li>
                                        <li>Let us use your location data to improve your route even when the app is closed</li>
                                    </ul>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <AnimatePresence>
                        {signupError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{signupError}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <Button
                            type="submit"
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                    Signing up...
                                </>
                            ) : (
                                "Sign up"
                            )}
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-sky-600 hover:text-sky-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}