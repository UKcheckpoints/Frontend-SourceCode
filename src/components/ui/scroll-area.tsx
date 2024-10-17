import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from "@/lib/utils/cn"

interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
    children: ReactNode
    className?: string
    viewportClassName?: string
}

const ScrollArea = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.Root>,
    ScrollAreaProps
>(({ children, className, viewportClassName, ...props }, ref) => (
    <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
    >
        <ScrollAreaPrimitive.Viewport className={cn("h-full w-full rounded-[inherit]", viewportClassName)}>
            {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-background to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-background to-transparent" />
    </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
    React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
        ref={ref}
        orientation={orientation}
        className={cn(
            "flex touch-none select-none transition-colors",
            orientation === "vertical" &&
            "h-full w-2.5 border-l border-l-transparent p-[1px]",
            orientation === "horizontal" &&
            "h-2.5 flex-col border-t border-t-transparent p-[1px]",
            className
        )}
        {...props}
    >
        <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

const ScrollContent = motion.create(ScrollAreaPrimitive.Viewport)

export { ScrollArea, ScrollContent }
