"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Truck, MapPin, Route, CheckCircle2 } from 'lucide-react'

type LoadingStep = 'locating' | 'planning' | 'optimizing' | 'ready'

const steps: LoadingStep[] = ['locating', 'planning', 'optimizing', 'ready']

const stepInfo = {
    locating: { icon: MapPin, message: 'Locating nearby checkpoints...' },
    planning: { icon: Route, message: 'Planning your optimal route...' },
    optimizing: { icon: Truck, message: 'Optimizing for your vehicle...' },
    ready: { icon: CheckCircle2, message: 'Ready to navigate!' },
}

export default function UserLoadingScreen() {
    const [currentStep, setCurrentStep] = useState<LoadingStep>('locating')
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const stepDuration = 3000 // 3 seconds per step
        let currentStepIndex = 0

        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                const newProgress = oldProgress + (100 / (steps.length * (stepDuration / 1000)))
                return newProgress > 100 ? 100 : newProgress
            })

            if ((currentStepIndex + 1) * (100 / steps.length) <= progress) {
                currentStepIndex++
                if (currentStepIndex < steps.length) {
                    setCurrentStep(steps[currentStepIndex])
                } else {
                    clearInterval(interval)
                }
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [progress])

    const { icon: StepIcon, message } = stepInfo[currentStep]

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-sky-100 to-sky-300 flex flex-col items-center justify-center overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-sky-800 mb-8"
            >
                UKcheckpoints
            </motion.div>

            <motion.div
                className="relative w-64 h-64 mb-8"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#0284c7" />
                            <stop offset="100%" stopColor="#7dd3fc" />
                        </linearGradient>
                    </defs>
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="10"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (progress / 100) * 283}
                    />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <StepIcon className="w-16 h-16 text-sky-600" />
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl font-semibold text-sky-700 mb-4"
                >
                    {message}
                </motion.div>
            </AnimatePresence>

            <div className="w-64 bg-sky-200 rounded-full h-2 mb-4">
                <motion.div
                    className="bg-sky-600 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="flex justify-between w-64 mb-8">
                {steps.map((step, index) => (
                    <motion.div
                        key={step}
                        className={`w-3 h-3 rounded-full ${index <= steps.indexOf(currentStep) ? 'bg-sky-600' : 'bg-sky-300'
                            }`}
                        initial={{ scale: 1 }}
                        animate={{ scale: currentStep === step ? 1.5 : 1 }}
                        transition={{ duration: 0.3 }}
                    />
                ))}
            </div>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-sky-700 text-opacity-80 text-center max-w-md text-lg"
            >
                We&apos;re preparing your personalized route and checkpoint information. This may take a few moments as we ensure everything is up-to-date for your journey.
            </motion.p>
        </div>
    )
}