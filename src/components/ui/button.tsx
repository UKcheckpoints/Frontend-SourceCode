import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'medium',
    icon: Icon,
    ...props
}) => {
    const baseStyles = "font-semibold rounded-full transition-all duration-300 ease-in-out flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2"

    const variantStyles = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
    }

    const sizeStyles = {
        small: "px-4 py-2 text-sm",
        medium: "px-6 py-3 text-base",
        large: "px-8 py-4 text-lg"
    }

    return (
        <motion.button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            {Icon && <Icon className="mr-2 h-5 w-5" />}
            {children}
        </motion.button>
    )
}