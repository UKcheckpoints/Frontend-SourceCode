'use client';

import UserLoadingScreen from '@/components/layout/Loader';
import dynamic from 'next/dynamic';
import React from 'react';

const MapPage = dynamic(() => import('@/components/layout/map/CheckpointMap'), {
    loading: () => <div><UserLoadingScreen /></div>,
    ssr: false,
});

function Page() {
    return (
        <div>
            <MapPage />
        </div>
    );
}

export default Page;
