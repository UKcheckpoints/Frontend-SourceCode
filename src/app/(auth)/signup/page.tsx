'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { MapIcon, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useForm } from "react-hook-form"
import Link from 'next/link'
import { SignupFormData } from '@/types/Auth'

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [signupError, setSignupError] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors }, watch } = useForm<SignupFormData>()

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true)
        setSignupError(null)

        try {
            await new Promise(resolve => setTimeout(resolve, 2000))
            console.log(data)
            // Here you would typically send the data to your backend
        } catch (error) {
            setSignupError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
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
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Create Account</h2>
                    <p className="text-sm text-gray-600 mb-8">Sign up to get started</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                        <Input
                            label="Username"
                            type="text"
                            autoComplete="username"
                            required
                            {...register("username", { required: "Username is required" })}
                            error={errors.username?.message}
                        />
                        <Input
                            label="Email"
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
                            error={errors.email?.message}
                        />
                        <Input
                            label="Password"
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
                            error={errors.password?.message}
                            showPasswordToggle
                        />
                        <Input
                            label="Confirm Password"
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
                            error={errors.confirmPassword?.message}
                            showPasswordToggle
                        />
                    </div>

                    <AnimatePresence>
                        {signupError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-500 text-sm mt-2 bg-red-100 p-3 rounded-md"
                            >
                                {signupError}
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