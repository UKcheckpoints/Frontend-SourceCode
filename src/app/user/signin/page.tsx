"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Lock, User, Truck, Clock, MapPin, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import dynamic from 'next/dynamic'
import logoImage from '@/public/logo.jpg'

const MapWithNoSSR = dynamic(() => import('@/components/ui/Map'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
})

type FormData = {
    username: string
    password: string
    rememberMe: boolean
}

export default function Login() {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        rememberMe: false
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showForgotUsername, setShowForgotUsername] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long')
            setIsLoading(false)
            return
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 2000))
            console.log('Logging in with:', formData)
            // Handle successful login here
        } catch (err) {
            setError('An error occurred during login. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleForgotUsername = async (email: string) => {
        console.log('Sending username recovery to:', email)
        setShowForgotUsername(false)
    }

    const handleForgotPassword = async (username: string) => {
        console.log('Sending password reset to:', username)
        setShowForgotPassword(false)
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white to-sky-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-lg md:max-w-xl lg:max-w-6xl flex flex-col lg:flex-row"
            >
                <div className="lg:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-between">
                    <div>
                        <Image src={logoImage} alt="UKcheckpoints Logo" width={50} height={50} className="mb-6" priority />
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-sans">UKcheckpoints</h1>
                        <p className="text-gray-600 mb-1 font-inter">Premium checkpoint information service</p>
                        <p className="text-sm text-gray-500 font-inter">400+ checkpoints & hotspots updated in realtime</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 mt-6 md:mt-8">
                        <div className="space-y-2">
                            <Label htmlFor="username" font="sans">Username</Label>
                            <div className="relative">
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="pl-10"
                                    font="inter"
                                />
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                            <div className="text-right">
                                <Link href={'/user/forgot-username'}>
                                    <Button variant="link" className="text-xs font-sans" onClick={() => setShowForgotUsername(true)}>
                                        Forgot username?
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" font="sans">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="pl-10 pr-10"
                                    font="inter"
                                />
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            <div className="text-right">
                                <Link href={'/user/forgot-password'}>
                                    <Button variant="link" className="text-xs font-sans">
                                        Forgot password?
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))}
                            />
                            <Label htmlFor="rememberMe" font="inter">Remember me</Label>
                        </div>
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <Alert variant="destructive">
                                        <AlertDescription font="inter">{error}</AlertDescription>
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <Button type="submit" className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-sans" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600 font-inter">
                        Don't have an account?{' '}
                        <Link href="/user/signup" className="font-medium text-sky-600 hover:text-sky-500 font-sans">
                            Sign up here
                        </Link>
                    </p>
                </div>
                <div className="lg:w-1/2 relative hidden lg:block">
                    <MapWithNoSSR />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6">
                        <motion.div
                            className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg max-w-sm w-full"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-xl font-bold mb-4 font-sans">Unlock Full Access</h2>
                            <p className="mb-4 font-inter">Sign up now to access advanced features:</p>
                            <ul className="space-y-2 mb-6">
                                <motion.li className="flex items-center" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                                    <Truck className="h-5 w-5 text-sky-600 mr-2" />
                                    <span className="font-inter">Real-time vehicle tracking</span>
                                </motion.li>
                                <motion.li className="flex items-center" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                                    <Clock className="h-5 w-5 text-sky-600 mr-2" />
                                    <span className="font-inter">24/7 checkpoint updates</span>
                                </motion.li>
                                <motion.li className="flex items-center" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
                                    <MapPin className="h-5 w-5 text-sky-600 mr-2" />
                                    <span className="font-inter">Custom route planning</span>
                                </motion.li>
                            </ul>
                            <Button className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-sans">Sign Up Now</Button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}