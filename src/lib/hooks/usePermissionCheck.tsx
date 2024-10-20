import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

type PermissionType = 'geolocation' | 'notification';
type PermissionStatus = 'granted' | 'denied' | 'prompt';

export const useSequentialPermissions = () => {
    const [currentPermission, setCurrentPermission] = useState<PermissionType>('geolocation');
    const [showPrompt, setShowPrompt] = useState(false);
    const [permissions, setPermissions] = useState<Record<PermissionType, PermissionStatus>>({
        geolocation: 'prompt',
        notification: 'prompt',
    });

    const checkPermission = async (type: PermissionType) => {
        if ('permissions' in navigator) {
            const status = await navigator.permissions.query({ name: type as PermissionName });
            setPermissions(prev => ({ ...prev, [type]: status.state }));
            return status.state;
        }
        return 'prompt';
    };

    const requestPermission = async (type: PermissionType) => {
        if (type === 'geolocation') {
            return new Promise<PermissionStatus>((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    () => resolve('granted'),
                    () => resolve('denied')
                );
            });
        } else if (type === 'notification') {
            const result = await Notification.requestPermission();
            return result as PermissionStatus;
        }
        return 'denied';
    };

    const handleNextPermission = useCallback(() => {
        if (currentPermission === 'geolocation') {
            setCurrentPermission('notification');
        } else {
            setShowPrompt(false);
        }
    }, [currentPermission]);

    const requestCurrentPermission = async () => {
        const result = await requestPermission(currentPermission);
        setPermissions(prev => ({ ...prev, [currentPermission]: result }));

        if (result === 'granted') {
            handleNextPermission();
        } else {
            setShowPrompt(true);
        }
    };

    useEffect(() => {
        const checkCurrentPermission = async () => {
            const status = await checkPermission(currentPermission);
            if (status === 'prompt') {
                setShowPrompt(true);
            } else if (status === 'granted') {
                handleNextPermission();
            }
        };

        checkCurrentPermission();
    }, [currentPermission, handleNextPermission]);

    const PermissionPrompt: React.FC = () => (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative"
                    >
                        <button
                            onClick={() => setShowPrompt(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <FaTimes />
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Permission Required</h2>
                        <p className="mb-4">
                            This app requires {currentPermission} permission to function properly.
                        </p>
                        <button
                            onClick={requestCurrentPermission}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Grant {currentPermission.charAt(0).toUpperCase() + currentPermission.slice(1)} Permission
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return { permissions, PermissionPrompt };
};
