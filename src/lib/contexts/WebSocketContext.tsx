"use client"

import React, { createContext, useContext, ReactNode } from 'react';
import useWebSocket from '../hooks/useWebSocket';

type WebSocketContextType = ReturnType<typeof useWebSocket>;

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const webSocket = useWebSocket();
    return <WebSocketContext.Provider value={webSocket}>{children}</WebSocketContext.Provider>;
};

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocketContext must be used within a WebSocketProvider');
    }
    return context;
};
