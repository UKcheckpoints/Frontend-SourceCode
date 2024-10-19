"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Truck, MapPin, Loader2, CheckCircle2 } from 'lucide-react'

type LoadingStatus = 'locating' | 'optimizing' | 'preparing' | 'ready'

interface LoadingScreenProps {
    status: LoadingStatus
    icon?: React.ElementType
}

const statusMessages = {
    locating: 'Locating checkpoints...',
    optimizing: 'Optimizing your route...',
    preparing: 'Preparing your dashboard...',
    ready: 'Ready to navigate!',
}

const iconComponents = {
    locating: MapPin,
    optimizing: Truck,
    preparing: Loader2,
    ready: CheckCircle2,
}

const checkpointColors = ['bg-red-500', 'bg-amber-500', 'bg-green-500']

export default function LoadingScreen({ status, icon: CustomIcon }: LoadingScreenProps) {
    const Icon = CustomIcon || iconComponents[status]
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(timer)
                    return 100
                }
                const diff = Math.random() * 10
                return Math.min(oldProgress + diff, 100)
            })
        }, 500)

        return () => {
            clearInterval(timer)
        }
    }, [])

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-sky-100 to-sky-300 flex flex-col items-center justify-center overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 mb-8"
            >
                <svg viewBox="0 0 100 100">
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="10"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: progress / 100 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </svg>
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Icon className="w-12 h-12 text-sky-600" />
                </motion.div>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-sky-800 mb-4"
            >
                Loading UKcheckpoints
            </motion.h2>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex space-x-3 mb-6"
            >
                {checkpointColors.map((color, index) => (
                    <motion.div
                        key={index}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: index * 0.2
                        }}
                        className={`w-5 h-5 rounded-full ${color}`}
                    />
                ))}
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={status}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center text-sky-700 text-xl mb-6"
                >
                    <span>{statusMessages[status]}</span>
                </motion.div>
            </AnimatePresence>

            <motion.div
                className="w-64 h-2 bg-sky-200 rounded-full overflow-hidden mb-4"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="h-full bg-sky-600 rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-4 text-sky-700 text-opacity-80 text-center max-w-md text-lg"
            >
                We&apos;re preparing your checkpoint management dashboard. This may take a few moments as we gather the latest data on checkpoint statuses and optimize your route.
            </motion.p>

            <motion.div
                className="mt-8 flex space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                {['Route Planning', 'Real-time Updates', 'Checkpoint Status'].map((feature) => (
                    <motion.div
                        key={feature}
                        className="bg-white bg-opacity-30 rounded-lg p-3 text-sky-800"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {feature}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}