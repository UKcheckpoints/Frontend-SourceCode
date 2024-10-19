import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

interface PermissionStatus {
    geolocation: 'granted' | 'denied' | 'prompt';
    notification: 'granted' | 'denied' | 'prompt';
}

export const usePermissionCheck = () => {
    const [permissions, setPermissions] = useState<PermissionStatus>({
        geolocation: 'prompt',
        notification: 'prompt',
    });
    const [showPrompt, setShowPrompt] = useState(false);

    const checkPermissions = async () => {
        if ('permissions' in navigator) {
            const geoStatus = await navigator.permissions.query({ name: 'geolocation' });
            const notificationStatus = await navigator.permissions.query({ name: 'notifications' });

            setPermissions({
                geolocation: geoStatus.state,
                notification: notificationStatus.state,
            });

            if (geoStatus.state === 'prompt' || notificationStatus.state === 'prompt') {
                setShowPrompt(true);
            } else {
                setShowPrompt(false);
            }

            geoStatus.onchange = () => {
                setPermissions(prev => ({ ...prev, geolocation: geoStatus.state }));
            };

            notificationStatus.onchange = () => {
                setPermissions(prev => ({ ...prev, notification: notificationStatus.state }));
            };
        }
    };

    useEffect(() => {
        checkPermissions();
    }, []);

    const requestPermissions = async () => {
        if (permissions.geolocation === 'prompt') {
            await navigator.geolocation.getCurrentPosition(() => { });
        }
        if (permissions.notification === 'prompt') {
            await Notification.requestPermission();
        }
        checkPermissions();
    };

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
                            This app requires geolocation and notification permissions to function properly.
                        </p>
                        <button
                            onClick={requestPermissions}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Grant Permissions
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return { permissions, PermissionPrompt, requestPermissions };
};
