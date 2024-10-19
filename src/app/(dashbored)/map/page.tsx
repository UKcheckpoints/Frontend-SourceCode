// pages/map.tsx
'use client';

import React, { useEffect } from 'react';
import { usePermissionCheck } from '@/lib/hooks/usePermissionCheck';

const MapPage = () => {
    const { permissions, PermissionPrompt, requestPermissions } = usePermissionCheck();

    useEffect(() => {
        if (permissions.geolocation === 'prompt' || permissions.notification === 'prompt') {
            requestPermissions();
        }
    }, [permissions, requestPermissions]);

    return (
        <div>
            <h1>My App</h1>
            <p>Geolocation permission: {permissions.geolocation}</p>
            <p>Notification permission: {permissions.notification}</p>
            <PermissionPrompt />
        </div>
    );
};

export default MapPage;
