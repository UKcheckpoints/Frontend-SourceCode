"use client";

import React, { useState, useEffect } from 'react';
import MapComponent from '@/components/layout/Map';
import { Checkpoint } from '@/lib/data/checkpoints';

const App: React.FC = () => {
    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCheckpoints = async () => {
            try {
                const mockCheckpoints: Checkpoint[] = [
                    { id: 'cp0', name: 'Checkpoint 0', lat: 51.5074, lng: -0.1278, status: "Red" },
                    { id: 'cp1', name: 'Checkpoint 1', lat: 51.5157, lng: -0.0886, status: 'Green' },
                    { id: 'cp2', name: 'Checkpoint 2', lat: 51.5007, lng: -0.1246, status: 'Amber' },
                    { id: 'cp3', name: 'Checkpoint 3', lat: 51.5074, lng: -0.1223, status: 'Red' },
                    { id: 'cp4', name: 'Checkpoint 4', lat: 51.5033, lng: -0.1195, status: 'Green' }
                ];

                await new Promise(resolve => setTimeout(resolve, 1000));

                setCheckpoints(mockCheckpoints);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching checkpoints:', error);
                setIsLoading(false);
            }
        };

        fetchCheckpoints();
    }, []);

    const handleCheckpointStatusChange = (id: string, status: 'Red' | 'Green' | 'Amber') => {
        setCheckpoints(prevCheckpoints =>
            prevCheckpoints.map(checkpoint =>
                checkpoint.id === id ? { ...checkpoint, status } : checkpoint
            )
        );
    };

    if (isLoading) {
        return <div>Loading checkpoints...</div>;
    }

    return (
        <MapComponent
            apiKey="UZx_Dhu7H1Ow-1XeJewvuxMgE1w28JjAsBRunWx_5O4"
            initialCenter={{ lat: 51.5074, lng: -0.1278 }}
            initialZoom={13}
            checkpoints={checkpoints}
            onCheckpointStatusChange={handleCheckpointStatusChange}
        />
    );
};

export default App;
