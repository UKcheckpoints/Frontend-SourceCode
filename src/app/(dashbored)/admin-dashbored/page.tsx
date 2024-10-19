"use client"

import UserDashboard from '@/components/layout/admin/UserSection'
import React from 'react'

export default function AdminDashboard() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
            <UserDashboard isSuperAdmin={true} />
        </div>
    )
}

