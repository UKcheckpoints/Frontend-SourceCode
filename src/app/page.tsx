"use client"

import React, { useState } from 'react'
import { MenuIcon } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import Link from 'next/link'
import { features, navItems, quickActions } from '@/constants/layout/Hero'
import logoImage from '@/assets/logo.jpg'
import Image from 'next/image'
import Chatbot from '@/components/layout/ChatBot'

export default function Component() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 text-sky-900">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image src={logoImage} width={32} height={32} alt='ukcheckpoint logo' />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-sky-400">UKcheckpoints</span>
        </motion.div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {navItems.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={item.href} className="hover:text-sky-600 transition-colors">{item.name}</Link>
              </motion.li>
            ))}
          </ul>
        </nav>
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg rounded-b-lg z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="py-2">
              {navItems.map((item) => (
                <li key={item.name} className="px-4 py-2">
                  <Link href={item.href} className="block hover:text-sky-600 transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 py-16">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-sky-400 leading-tight">
            Revolutionize Your Routes with UKcheckpoints
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl text-sky-700">
            Experience the future of commercial vehicle checkpoint management and route planning. Optimize your journeys, save time, and increase efficiency.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Link href={'/login'}>
              <Button size="lg" className="bg-sky-500 hover:bg-white hover:text-sky-500 text-white border border-sky-500 hover:border-sky-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8 max-w-5xl mx-auto shadow-xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-semibold text-sky-800 mb-8 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickActions.map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-white bg-opacity-50 rounded-lg p-6 flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:bg-opacity-70"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              >
                <item.icon className="h-16 w-16 text-sky-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-sky-800">{item.title}</h3>
                <p className="text-sm text-center text-sky-700">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-semibold text-sky-800 mb-8 text-center">Why Choose UKcheckpoints?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white bg-opacity-30 rounded-lg p-6 flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:bg-opacity-50"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              >
                <feature.icon className="h-12 w-12 text-sky-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-sky-700">{feature.title}</h3>
                <p className="text-sm text-center text-sky-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <Chatbot />
      </main>
    </div>
  )
}