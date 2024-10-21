import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useSignupRedirect() {
    const router = useRouter();

    useEffect(() => {
        const signupCompleted = localStorage.getItem('signupCompleted');
        const needToPay = localStorage.getItem('needToPay');
        if (signupCompleted === 'true' && needToPay === 'true') {
            const payid = localStorage.getItem("pay_id");
            router.push(`/payment?pay_id=${payid!}`);
        }
    }, [router]);
}
