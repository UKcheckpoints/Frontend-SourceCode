import { NavItem, QuickAction } from "@/types/Hero"
import { CheckCircleIcon, MapIcon, RouteIcon, TruckIcon } from "lucide-react"

export const navItems: NavItem[] = [
    { name: 'Affiliate Program', href: '#' },
    { name: 'Whatsapp', href: '#' },
]

export const quickActions: QuickAction[] = [
    { icon: MapIcon, title: "View Checkpoints", description: "Monitor real-time status of checkpoints across the UK." },
    { icon: RouteIcon, title: "Plan Routes", description: "Create optimized routes based on vehicle specifications and checkpoints." },
    { icon: TruckIcon, title: "Vehicle Management", description: "Add and manage your fleet for personalized route planning." },
]

export const features = [
    { icon: CheckCircleIcon, title: "Real-time Updates", description: "Get instant notifications on checkpoint status changes." },
    { icon: RouteIcon, title: "Smart Routing", description: "AI-powered route optimization for maximum efficiency." },
    { icon: TruckIcon, title: "Fleet Analytics", description: "Comprehensive insights into your fleet's performance." },
]