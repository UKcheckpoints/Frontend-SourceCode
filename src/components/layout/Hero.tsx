'use client'

import React, { useState, useEffect, ButtonHTMLAttributes, ReactNode } from 'react'
import { Moon, Sun, Menu, X, MapPin, Truck, Clock, Shield, Users } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { motion, AnimatePresence, useAnimation, Variants, MotionProps } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import logoImage from '@/public/logo.jpg'

const MapWithNoSSR = dynamic(() => import('@/components/ui/Map'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-200 animate-pulse rounded-lg" />
})

type MergedButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> & MotionProps;

interface ButtonProps extends MergedButtonProps {
    children: ReactNode;
    variant?: 'default' | 'gradient' | 'outline';
    icon?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'default', icon, ...props }) => {
    return (
        <motion.button
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out flex items-center justify-center ${variant === 'default'
                ? 'bg-sky-600 text-white hover:bg-sky-700 hover:shadow-lg'
                : variant === 'outline'
                    ? 'bg-transparent border-2 border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white hover:shadow-lg'
                    : 'bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:from-sky-500 hover:to-blue-600 hover:shadow-lg'
                }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </motion.button>
    )
}

interface StatBoxProps {
    number: string
    text: string
}

const StatBox: React.FC<StatBoxProps> = ({ number, text }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300"
        >
            <motion.h3
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent mb-2"
            >
                {number}+
            </motion.h3>
            <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-gray-600 dark:text-gray-300"
            >
                {text}
            </motion.p>
        </motion.div>
    )
}

interface FeatureProps {
    icon: React.ReactNode
    title: string
    description: string
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
    <motion.div
        variants={itemVariants}
        className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300"
    >
        <motion.div
            className="text-sky-600 dark:text-sky-400 mb-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
        >
            {icon}
        </motion.div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-center">{description}</p>
    </motion.div>
)

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2
        }
    }
}

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
}

const mapVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: 'easeOut'
        }
    }
}

export default function Hero() {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const controls = useAnimation()
    const [ref, inView] = useInView()

    useEffect(() => {
        if (inView) {
            controls.start('visible')
        }
    }, [controls, inView])

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
        document.documentElement.classList.toggle('dark')
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <>
            <div className="min-h-screen w-screen overflow-hidden bg-gradient-to-b from-white to-sky-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
                <header className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Image src={logoImage} alt="UKcheckpoints Logo" width={40} height={40} className="mr-3" priority />
                        <span className="text-xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">UKcheckpoints</span>
                    </div>
                    <nav className="hidden md:flex items-center space-x-6">
                        <a href="#" className="text-gray-600 hover:text-sky-600 dark:text-gray-300 dark:hover:text-sky-400 transition-colors duration-200 flex items-center">
                            <Users className="h-5 w-5 mr-1" />
                            Affiliate Program
                        </a>
                        <a href="#" className="text-gray-600 hover:text-sky-600 dark:text-gray-300 dark:hover:text-sky-400 transition-colors duration-200 flex items-center">
                            <FaWhatsapp className="h-5 w-5 mr-1" />
                            WhatsApp
                        </a>
                    </nav>
                    <div className="flex items-center">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full text-gray-600 hover:text-sky-600 dark:text-gray-300 dark:hover:text-sky-400 focus:outline-none transition-colors duration-200"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <button
                            onClick={toggleMenu}
                            className="ml-4 p-2 rounded-lg md:hidden text-gray-600 hover:text-sky-600 dark:text-gray-300 dark:hover:text-sky-400 focus:outline-none transition-colors duration-200"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </header>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden"
                        >
                            <nav className="px-4 pt-2 pb-4 space-y-2">
                                <a href="#" className="text-gray-600 hover:text-sky-600 dark:text-gray-300 dark:hover:text-sky-400 transition-colors duration-200 flex items-center">
                                    <Users className="h-5 w-5 mr-1" />
                                    Affiliate Program
                                </a>
                                <a href="#" className="text-gray-600 hover:text-sky-600 dark:text-gray-300 dark:hover:text-sky-400 transition-colors duration-200 flex items-center">
                                    <FaWhatsapp className="h-5 w-5 mr-1" />
                                    WhatsApp
                                </a>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>

                <main className="container mx-auto px-4 py-16 text-center">
                    <motion.div
                        ref={ref}
                        animate={controls}
                        initial="hidden"
                        variants={containerVariants}
                    >
                        <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                            Revolutionize Your Commercial Vehicle Routes
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-xl mb-8 text-gray-600 dark:text-gray-300">
                            UKcheckpoints: Your trusted partner for efficient route planning and real-time checkpoint monitoring.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex justify-center space-x-4">
                            <Button icon={<Truck className="h-5 w-5 hover:text-blue-500 hover:scale-110 transition-transform duration-200" />} variant="gradient">
                                Start Optimizing Now
                            </Button>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={mapVariants}
                        initial="hidden"
                        animate={controls}
                        className="mt-16 rounded-lg overflow-hidden shadow-2xl"
                    >
                        <MapWithNoSSR />
                    </motion.div>

                    <motion.div
                        className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate={controls}
                    >
                        <Feature
                            icon={<MapPin className="h-12 w-12" />}
                            title="Real-time Checkpoints"
                            description="Stay informed with live checkpoint updates"
                        />
                        <Feature
                            icon={<Truck className="h-12 w-12" />}
                            title="Vehicle-Specific Routes"
                            description="Tailored routes for your fleet's needs"
                        />
                        <Feature
                            icon={<Clock className="h-12 w-12" />}
                            title="Time-Saving Solutions"
                            description="Optimize routes for maximum efficiency"
                        />
                        <Feature
                            icon={<Shield className="h-12 w-12" />}
                            title="Secure & Reliable"
                            description="Trusted by UK transport professionals"
                        />
                    </motion.div>

                    <motion.div
                        className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate={controls}
                    >
                        <StatBox number="10,000" text="Active Users" />
                        <StatBox number="500,000" text="Routes Optimized" />
                    </motion.div>
                </main>
            </div>
        </>
    )
}