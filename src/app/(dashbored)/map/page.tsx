'use client';

import UserLoadingScreen from '@/components/layout/Loader';
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
            <MapPage />
        </div>
    );
}

export default Page;


