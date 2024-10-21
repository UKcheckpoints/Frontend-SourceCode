import { useEffect, useRef, useState, useCallback } from 'react';

type ConnectionState = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

interface NodeAuthMessage {
    type: 'auth';
    email: string;
}

interface CheckpointUpdateNode {
    type: 'checkpointUpdate';
    id: string;
    status: 'ACTIVE' | 'INACTIVE' | 'UNKNOWN';
    comment?: string;
}

interface UserPushNotificationNode {
    type: 'pushNotification';
    content: string;
    userId: string;
}

interface RoutePlanUpdateNode {
    type: 'routePlanUpdate';
    vehicleId: string;
    route: string[];
}

interface TrafficUpdateNode {
    type: 'trafficUpdate';
    status: 'CONGESTED' | 'CLEAR' | 'UNKNOWN';
    affectedRoute: string;
}

type MessageType =
    | NodeAuthMessage
    | CheckpointUpdateNode
    | UserPushNotificationNode
    | RoutePlanUpdateNode
    | TrafficUpdateNode;

const useWebSocket = (url: string) => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [connectionState, setConnectionState] = useState<ConnectionState>('DISCONNECTED');
    const socketRef = useRef<WebSocket | null>(null);
    const isConnectedRef = useRef<boolean>(false);

    const handleError = (error: unknown) => {
        console.error('WebSocket error:', error);
        setConnectionState('ERROR');
        isConnectedRef.current = false;
        throw new Error(`WebSocket encountered an error: ${error}`);
    };

    const connectWebSocket = useCallback((emailBase64?: string) => {
        if (isConnectedRef.current) return;

        setConnectionState('CONNECTING');
        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = () => {
            setConnectionState('CONNECTED');
            isConnectedRef.current = true;

            if (emailBase64) {
                sendMessage({ type: 'auth', email: emailBase64 });
            }
        };

        socketRef.current.onmessage = (event: MessageEvent) => {
            try {
                const newMessage: MessageType = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            } catch (error) {
                handleError(error);
            }
        };

        socketRef.current.onclose = () => {
            setConnectionState('DISCONNECTED');
            isConnectedRef.current = false;
            setTimeout(() => connectWebSocket(), 3000);
        };

        socketRef.current.onerror = (error: Event) => {
            handleError(error);
        };
    }, [url]);

    const sendMessage = (message: MessageType) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        } else {
            const errorMessage = 'WebSocket is not open. Unable to send message.';
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isConnectedRef.current) {
                socketRef.current?.close();
                isConnectedRef.current = false;
                connectWebSocket();
            }
        }, 300000);

        return () => {
            clearInterval(intervalId);
            socketRef.current?.close();
            isConnectedRef.current = false;
        };
    }, [connectWebSocket]);

    return { messages, connectWebSocket, sendMessage, connectionState };
};

export default useWebSocket;
