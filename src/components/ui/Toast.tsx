// Toast.tsx
import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export type ToastProps = {
    title: string
    message: string
    type: 'success' | 'error' | 'info'
    duration?: number
    onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ title, message, type, duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            onClose()
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    if (!isVisible) return null

    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'

    return (
        <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg flex flex-col`}>
            <div className="flex justify-between items-center">
                <span className="font-bold">{title}</span>
                <button onClick={() => setIsVisible(false)} className="ml-2 focus:outline-none">
                    <X size={18} />
                </button>
            </div>
            <span>{message}</span>
        </div>
    )
}

export default Toast
