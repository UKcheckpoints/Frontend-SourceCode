"use client"
import React, { useState } from 'react'
import { CheckpointManagementContent } from '@/components/layout/admin/CheckPointSection'
import UserDashboard from '@/components/layout/admin/UserSection'
import { Users, MapPin, Menu, X, LogOut, ChevronLeft, Map } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { useMediaQuery } from "@/lib/hooks/useMediaQuery"
import { cn } from "@/lib/utils/cn"
import { useJwtValidator } from '@/lib/hooks/useJwtValidator'
import LoadingScreen from '@/components/layout/TruckLoader'
import { useRouter } from 'next/navigation'

interface NavButtonProps {
    icon: React.ComponentType<{ className?: string }>
    label: string
    section: string
    collapsed?: boolean
}

export default function AdminDashboard() {
    const [activeSection, setActiveSection] = useState('users')
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const isMobile = useMediaQuery("(max-width: 768px)")
    const router = useRouter();

    const { isLoadingState, isValid, userData } = useJwtValidator();

    if (isLoadingState) {
        return <LoadingScreen status="ready" />
    }

    if (!isValid) {
        router.push('/login')
        return <LoadingScreen status="ready" />
    } else if (userData?.role !== "SUPER_ADMIN" && userData?.role !== "ADMIN") {
        //   router.push('/map')
        //    return <LoadingScreen status="ready" />
    }

    const isSuperAdmin = userData?.role === "SUPER_ADMIN";

    const NavButton: React.FC<NavButtonProps> = ({ icon: Icon, label, section, collapsed }) => (
        <Button
            variant={activeSection === section ? "secondary" : "ghost"}
            className={cn(
                "w-full transition-all duration-300",
                collapsed ? "justify-center px-2" : "justify-start px-4",
                activeSection === section
                    ? 'bg-sky-100 text-sky-700'
                    : 'text-white hover:bg-sky-700'
            )}
            onClick={() => {
                if (section === 'map') {
                    router.push('/map')
                } else {
                    setActiveSection(section)
                    if (isMobile) setSidebarOpen(false)
                }
            }}
        >
            <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
            {!collapsed && label}
        </Button>
    )

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-sky-50 to-white">
            {/* Sidebar */}
            <nav className={cn(
                "fixed h-full z-50 bg-sky-600 text-white flex flex-col transition-all duration-300 ease-in-out",
                isMobile
                    ? cn("w-64", sidebarOpen ? "translate-x-0" : "-translate-x-full")
                    : cn(sidebarOpen ? "w-64" : "w-16")
            )}>
                <div className="flex justify-between items-center p-4">
                    {(!isMobile || sidebarOpen) && (
                        <h1 className={cn(
                            "font-bold transition-opacity duration-300",
                            sidebarOpen ? "text-2xl opacity-100" : "text-lg opacity-0"
                        )}>
                            Admin
                        </h1>
                    )}
                    <Button
                        variant="ghost"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={sidebarOpen ? "text-sky-700 bg-white" : "bg-sky-700 text-white"}
                    >
                        {isMobile ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <ChevronLeft className={cn(
                                "h-6 w-6 transition-transform duration-300",
                                !sidebarOpen && "rotate-180"
                            )} />
                        )}
                    </Button>
                </div>

                <div className="flex flex-col gap-2 p-2">
                    <NavButton
                        icon={Users}
                        label="User Management"
                        section="users"
                        collapsed={!sidebarOpen && !isMobile}
                    />
                    <NavButton
                        icon={MapPin}
                        label="Checkpoint Management"
                        section="checkpoints"
                        collapsed={!sidebarOpen && !isMobile}
                    />
                    <NavButton
                        icon={Map}
                        label="Map"
                        section="map"
                        collapsed={!sidebarOpen && !isMobile}
                    />
                </div>

                <div className="flex-grow" />

                <Button
                    variant="ghost"
                    className={cn(
                        "m-2 bg-white text-sky-700 hover:bg-sky-700 hover:text-white",
                        !sidebarOpen && !isMobile ? "justify-center px-2" : "justify-start px-4"
                    )}
                >
                    <LogOut className={cn("h-4 w-4", sidebarOpen && "mr-2")} />
                    {sidebarOpen && "Logout"}
                </Button>
            </nav>

            {/* Main content */}
            <main className={cn(
                "flex-grow flex flex-col transition-all duration-300",
                isMobile ? "ml-0" : (sidebarOpen ? "ml-64" : "ml-16")
            )}>
                {/* Top bar */}
                <div className="bg-white shadow-md p-4 flex items-center gap-4">
                    {isMobile && (
                        <Button variant="ghost" onClick={() => setSidebarOpen(true)}>
                            <Menu className="h-6 w-6" />
                        </Button>
                    )}
                    <h2 className="text-xl font-semibold text-sky-700 ml-24">
                        {activeSection === 'users' ? 'User Management' : 'Checkpoint Management'}
                    </h2>
                </div>

                {/* Dashboard content */}
                <div className="flex-grow p-6 overflow-auto">
                    {activeSection === 'users' && <UserDashboard isSuperAdmin={true} />}
                    {activeSection === 'checkpoints' && <CheckpointManagementContent isSuperAdmin={isSuperAdmin} />}
                </div>
            </main>
        </div>
    )
}
