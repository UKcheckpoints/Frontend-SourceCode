import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const inputVariants = cva(
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
    {
        variants: {
            variant: {
                default: "border-gray-300 focus:border-primary",
                error: "border-red-500 focus:border-red-500",
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

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, variant, font, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(inputVariants({ variant, font, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input, inputVariants }