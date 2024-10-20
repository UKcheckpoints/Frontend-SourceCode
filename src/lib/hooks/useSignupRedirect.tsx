import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useSignupRedirect() {
    const router = useRouter();

    useEffect(() => {
        const signupCompleted = localStorage.getItem('signupCompleted');
        if (signupCompleted === 'true') {
            router.push('/payment');
        }
    }, [router]);
}
