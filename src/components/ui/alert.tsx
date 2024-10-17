import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const alertVariants = cva(
    "relative w-full rounded-lg border p-4 flex flex-col md:flex-row md:items-center transition-all duration-300 ease-in-out",
    {
        variants: {
            variant: {
                default: "bg-background text-foreground hover:bg-background/90",
                destructive: "border-destructive/50 text-destructive dark:border-destructive bg-destructive/10 hover:bg-destructive/20",
                success: "border-green-500/50 text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30",
                warning: "border-yellow-500/50 text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/20 hover:bg-yellow-200 dark:hover:bg-yellow-900/30",
                info: "border-blue-500/50 text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30",
            },
            font: {
                sans: "font-sans",
                inter: "font-inter",
            },
        },
        defaultVariants: {
            variant: "default",
            font: "sans",
        },
    }
)

const Alert = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, font, ...props }, ref) => (
    <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant, font }), className)}
        {...props}
    />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement> & { font?: "sans" | "inter" }
>(({ className, font = "sans", ...props }, ref) => (
    <h5
        ref={ref}
        className={cn("mb-1 font-medium leading-none tracking-tight text-lg md:text-xl",
            font === "sans" ? "font-sans" : "font-inter",
            className
        )}
        {...props}
    />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement> & { font?: "sans" | "inter" }
>(({ className, font = "sans", ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm md:text-base [&_p]:leading-relaxed",
            font === "sans" ? "font-sans" : "font-inter",
            className
        )}
        {...props}
    />
))
AlertDescription.displayName = "AlertDescription"

const AlertIcon = React.forwardRef<
    SVGSVGElement,
    React.SVGProps<SVGSVGElement>
>(({ className, ...props }, ref) => (
    <svg
        ref={ref}
        className={cn("h-5 w-5 mr-3 flex-shrink-0", className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
    />
))
AlertIcon.displayName = "AlertIcon"

export { Alert, AlertTitle, AlertDescription, AlertIcon, alertVariants }
