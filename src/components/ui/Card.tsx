'use client'

import React from 'react'
import { HTMLMotionProps, motion } from 'framer-motion'
import { cn } from "@/lib/utils/cn"
import { cva, type VariantProps } from "class-variance-authority"

const cardVariants = cva(
    "rounded-lg shadow-lg overflow-hidden transition-all duration-300",
    {
        variants: {
            intent: {
                primary: "bg-primary text-primary-foreground",
                secondary: "bg-secondary text-secondary-foreground",
                accent: "bg-accent text-accent-foreground",
                ghost: "bg-background hover:bg-accent hover:text-accent-foreground",
            },
            size: {
                sm: "p-4",
                md: "p-6",
                lg: "p-8",
            },
        },
        defaultVariants: {
            intent: "primary",
            size: "md",
        },
    }
)

export interface CardProps
    extends HTMLMotionProps<"div">,
    VariantProps<typeof cardVariants> {
    hoverEffect?: 'lift' | 'glow' | 'border' | 'none'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, intent, size, hoverEffect = 'none', children, ...props }, ref) => {
        const hoverStyles = {
            lift: "hover:-translate-y-2",
            glow: "hover:shadow-glow",
            border: "hover:border-2 hover:border-primary",
            none: "",
        }

        return (
            <motion.div
                ref={ref}
                className={cn(
                    cardVariants({ intent, size }),
                    hoverStyles[hoverEffect],
                    "flex flex-col",
                    className
                )}
                whileHover={{ scale: hoverEffect !== 'none' ? 1.02 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)

Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("text-lg font-semibold leading-none tracking-tight", className)}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
