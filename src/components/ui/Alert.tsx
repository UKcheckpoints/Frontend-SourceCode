import React from 'react'
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from "@/lib/utils/cn"
import { motion, MotionValue, HTMLMotionProps } from 'framer-motion'

const alertVariants = cva(
    "relative w-full rounded-lg border p-4 shadow-md [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
    {
        variants: {
            variant: {
                default: "bg-white text-gray-900 border-gray-200",
                destructive: "bg-red-50 border-red-200 text-red-900 [&>svg]:text-red-600",
                success: "bg-green-50 border-green-200 text-green-900 [&>svg]:text-green-600",
                warning: "bg-yellow-50 border-yellow-200 text-yellow-900 [&>svg]:text-yellow-600",
                info: "bg-blue-50 border-blue-200 text-blue-900 [&>svg]:text-blue-600",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

const icons = {
    default: Info,
    destructive: XCircle,
    success: CheckCircle,
    warning: AlertCircle,
    info: Info,
}

export interface AlertProps
    extends HTMLMotionProps<"div">,
    VariantProps<typeof alertVariants> {
    title?: string
    children?: React.ReactNode | MotionValue<number> | MotionValue<string>
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant, title, children, ...props }, ref) => {
        const Icon = icons[variant || 'default']

        // Convert MotionValue to plain value for rendering
        const resolvedChildren =
            typeof children === 'object' && 'get' in children!
                ? children.get()
                : children

        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                ref={ref}
                role="alert"
                className={cn(alertVariants({ variant }), className)}
                {...props}
            >
                <Icon className="h-5 w-5" />
                {title && (
                    <h5 className="mb-1 font-semibold leading-none tracking-tight text-lg">
                        {title}
                    </h5>
                )}
                <div className="text-sm [&_p]:leading-relaxed mt-1">
                    {resolvedChildren}
                </div>
            </motion.div>
        )
    }
)
Alert.displayName = "Alert"

export { Alert, alertVariants }

export const AlertTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h5
        ref={ref}
        className={cn("mb-1 font-medium leading-none tracking-tight", className)}
        {...props}
    />
))
AlertTitle.displayName = "AlertTitle"

export const AlertDescription = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm [&_p]:leading-relaxed", className)}
        {...props}
    />
))
AlertDescription.displayName = "AlertDescription"
