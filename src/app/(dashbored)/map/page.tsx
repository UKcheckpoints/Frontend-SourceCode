'use client';

import UserLoadingScreen from '@/components/layout/Loader';
import { ToastProvider } from '@/components/ui/UseToast';
import { useSignupRedirect } from '@/lib/hooks/useSignupRedirect';
import dynamic from 'next/dynamic';
import React from 'react';

const MapPage = dynamic(() => import('@/components/layout/map/CheckpointMap'), {
    loading: () => <div><UserLoadingScreen /></div>,
    ssr: false,
});

function Page() {
    useSignupRedirect();

    return (
        <div>
            <ToastProvider>
                <MapPage />
            </ToastProvider>
        </div>
    );
}

export default Page;


