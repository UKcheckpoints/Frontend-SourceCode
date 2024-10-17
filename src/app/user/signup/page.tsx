"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, XCircle, Bell, MapPin, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'

const termsItems = [
    "We require access to your location for accurate checkpoint information.",
    "We may send notifications for important updates and alerts.",
    "Your data will be handled in accordance with our privacy policy."
];

type FormData = {
    username: string
    email: string
    password: string
    confirmPassword: string
    acceptTerms: boolean
}

export default function Signup() {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showTerms, setShowTerms] = useState(false)
    const router = useRouter()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match")
            return false
        }
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long")
            return false
        }
        if (!formData.acceptTerms) {
            setError("You must accept the terms and conditions")
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!validateForm()) return

        setIsLoading(true)

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Handle successful signup here
            console.log('Signup successful:', formData)
            router.push('/user/signin')
        } catch {
            setError('An error occurred during signup. Please try again.')
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Create an Account</h2>
                <p className="text-gray-600 mb-6 font-inter">Sign up to access UKcheckpoints services.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username" font="sans" className="text-sm font-medium text-gray-700">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            required
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
                            font="inter"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" font="sans" className="text-sm font-medium text-gray-700">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
                            font="inter"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" font="sans" className="text-sm font-medium text-gray-700">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50 pr-10"
                                font="inter"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" font="sans" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50 pr-10"
                                font="inter"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                        <Checkbox
                            id="acceptTerms"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))}
                            className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                        />
                        <Label htmlFor="acceptTerms" className="text-sm text-gray-600">
                            I accept the{' '}
                            <Dialog open={showTerms} onOpenChange={setShowTerms}>
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        className="text-sky-600 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                    >
                                        terms and conditions
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-bold text-gray-900">
                                            Terms and Conditions
                                        </DialogTitle>
                                        <DialogDescription className="mt-2 text-sm text-gray-600">
                                            By using UKcheckpoints, you agree to the following:
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-6 space-y-4">
                                        {termsItems.map((item, index) => (
                                            <div key={index} className="flex items-start space-x-3">
                                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                <p className="text-sm text-gray-700">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8">
                                        <Button
                                            onClick={() => setShowTerms(false)}
                                            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                                        >
                                            I Understand and Agree
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600 font-inter">
                        <MapPin className="h-4 w-4 text-sky-500" />
                        <span>Location permission required</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600 font-inter">
                        <Bell className="h-4 w-4 text-sky-500" />
                        <span>Notifications may be sent for updates</span>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Alert variant="destructive" className="rounded-md bg-red-50 p-4">
                                    <XCircle className="h-5 w-5 text-red-400" />
                                    <AlertDescription font="inter" className="ml-3 text-sm text-red-700">{error}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-sans py-2 px-4 rounded-md transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Signing Up...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 font-inter">
                        Already have an account?{' '}
                        <Link href="/user/signin" className="font-medium text-sky-600 hover:text-sky-500 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 font-sans">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}