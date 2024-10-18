'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Truck, MapPin } from 'lucide-react'

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-sky-100 to-sky-300 flex flex-col items-center justify-center">
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 100, opacity: 1 }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
                className="mb-8 relative"
            >
                <Truck className="w-24 h-24 text-sky-600" />
                <motion.div
                    className="absolute -bottom-2 left-0 right-0"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="h-1 bg-sky-600 rounded-full" />
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ width: 0 }}
                animate={{ width: "60%" }}
                transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                className="h-2 bg-sky-500 rounded-full mb-4"
            />

            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-sky-800 mb-4"
            >
                Loading UKcheckpoints
            </motion.h2>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex space-x-2 mb-4"
            >
                {['red', 'amber', 'green'].map((color, index) => (
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
                        className={`w-4 h-4 rounded-full bg-${color}-500`}
                    />
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center text-sky-700 mb-4"
            >
                <MapPin className="w-5 h-5 mr-2" />
                <span>Locating checkpoints...</span>
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-4 text-sky-700 text-opacity-80 text-center max-w-md"
            >
                We're preparing your checkpoint management dashboard. This may take a few moments as we gather the latest data on checkpoint statuses and optimize your route.
            </motion.p>
        </div>
    )
}
