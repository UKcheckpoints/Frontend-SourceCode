"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import Toast, { ToastProps } from './Toast'

type ToastVariant = 'default' | 'destructive'

interface ToastContextProps {
    title: string
    description: string
    variant: ToastVariant
}

interface ToastContextType {
    toast: (props: ToastContextProps) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastProps[]>([])

    const toast = (props: ToastContextProps) => {
        const newToast: ToastProps = {
            title: props.title,
            message: props.description,
            type: props.variant === 'destructive' ? 'error' : 'info',
            onClose: () => setToasts(prevToasts => prevToasts.filter(t => t !== newToast))
        }
        setToasts((prevToasts) => [...prevToasts, newToast])
        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter(t => t !== newToast))
        }, 3000)
    }

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
                {toasts.map((t, index) => (
                    <Toast key={index} {...t} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext)
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
