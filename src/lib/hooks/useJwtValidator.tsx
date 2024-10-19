import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

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
    const pathname = usePathname();

    const logout = useCallback(() => {
        setIsValid(false);
        setUserData(null);
        setError(null);
        router.push('/login');
    }, [router]);

    const validateToken = useCallback(async () => {
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
                throw new Error('API URL is not defined');
            }

            const response = await axios.get(
                `${apiUrl}/user/validate-jwt`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                const data = response.data;
                setIsValid(true);
                setUserData(data.userData);
                setError(null);
            } else {
                throw new Error('Invalid token');
            }
        } catch (err) {
            console.log(err)
            setIsValid(false);
            setError(err instanceof Error ? err.message : 'Error validating token');
            console.error('JWT validation error:', err);
            logout();
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    const revalidate = useCallback(async () => {
        await validateToken();
    }, [validateToken]);

    useEffect(() => {
        validateToken();
    }, [validateToken, pathname]);

    return { isValid, isLoadingState, userData, error, logout, revalidate };
}
