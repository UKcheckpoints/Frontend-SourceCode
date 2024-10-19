import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface UserData {
    id: number;
    username: string;
    email: string;
    role: string;
    isSubscribed: boolean;
}

interface JwtValidatorResult {
    isValid: boolean;
    isLoadingState: boolean;
    userData: UserData | null;
    error: string | null;
    logout: () => void;
    revalidate: () => Promise<void>;
}

export function useJwtValidator(): JwtValidatorResult {
    const [isValid, setIsValid] = useState<boolean>(false);
    const [isLoadingState, setIsLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const logout = useCallback(() => {
        Cookies.remove('jwt');
        setIsValid(false);
        setUserData(null);
        setError(null);
        router.push('/login');
    }, [router]);

    const validateToken = useCallback(async () => {
        const jwtCookie = Cookies.get('jwt');

        if (!jwtCookie) {
            setIsValid(false);
            setError('No JWT found');
            setIsLoading(false);
            router.push('/')
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
                throw new Error('API URL is not defined');
            }

            const response = await fetch(`${apiUrl}/user/validate-jwt`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setIsValid(true);
                setUserData(data.userData);
                setError(null);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Invalid token');
            }
        } catch (err) {
            setIsValid(false);
            setError(err instanceof Error ? err.message : 'Error validating token');
            console.error('JWT validation error:', err);
            logout();
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    const revalidate = useCallback(async () => {
        setIsLoading(true);
        await validateToken();
    }, [validateToken]);

    useEffect(() => {
        validateToken();
    }, [validateToken]);

    return { isValid, isLoadingState, userData, error, logout, revalidate };
}
