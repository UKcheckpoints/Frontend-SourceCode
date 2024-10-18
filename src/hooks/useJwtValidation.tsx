import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface UserData {
    id: number
    username: string
    email: string
    role: string
    isSubscribed: boolean
}

export function useJwtValidation() {
    const [isLoading, setIsLoading] = useState(true)
    const [userData, setUserData] = useState<UserData | null>(null)
    const router = useRouter()

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/validate-jwt`, {}, {
                    withCredentials: true
                })

                if (response.status === 200) {
                    setUserData(response.data.userData)
                    if (response.data.userData.role === 'superadmin' || response.data.userData.role === 'admin') {
                        router.push('/admin-dashboard')
                    } else {
                        router.push('/dashboard')
                    }
                }
            } catch (error) {
                console.error('Token validation failed:', error)
            } finally {
                setIsLoading(false)
            }
        }

        validateToken()
    }, [router])

    return { isLoading, userData }
}