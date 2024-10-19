import React, { useEffect, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';

interface MapProps {
    center?: { lat: number; lng: number };
    zoom?: number;
    className?: string;
    style?: React.CSSProperties;
    markers?: Array<{
        position: { lat: number; lng: number };
        popup?: string;
    }>;
    children?: React.ReactNode;
}

const MapUpdater: React.FC<{ center: { lat: number; lng: number }; zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo([center.lat, center.lng], zoom, { duration: 1.5, easeLinearity: 0.25 });
    }, [center, zoom, map]);
    return null;
};

const AnimatedMarker: React.FC<{ position: [number, number]; popup?: string }> = ({ position, popup }) => {
    const [isVisible, setIsVisible] = useState(false);
    const map = useMapEvents({
        moveend: () => setIsVisible(true),
        zoomend: () => setIsVisible(true),
    });

    useEffect(() => {
        setIsVisible(map.getBounds().contains(position));
    }, [map, position]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
                >
                    <Marker position={position}>
                        {popup && <Popup>{popup}</Popup>}
                    </Marker>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const CustomZoomControl: React.FC = () => {
    const map = useMap();

    const handleZoomIn = () => {
        map.zoomIn();
    };

    const handleZoomOut = () => {
        map.zoomOut();
    };

    return (
        <div className="custom-zoom-control">
            <button onClick={handleZoomIn} aria-label="Zoom in"><FaPlus /></button>
            <button onClick={handleZoomOut} aria-label="Zoom out"><FaMinus /></button>
        </div>
    );
};

const LeafletMap: React.FC<MapProps> = ({
    center = { lat: 51.5074, lng: -0.1278 },
    zoom = 13,
    className = '',
    style,
    markers = [],
    children,
}) => {
    const [map, setMap] = useState<L.Map | null>(null);

    const onMapReady = useCallback((mapInstance: L.Map) => {
        setMap(mapInstance);
    }, []);

    useEffect(() => {
        if (map) {
            map.invalidateSize();
        }
    }, [map]);

    return (
        <motion.div
            className={`leaflet-container ${className}`}
            style={{ height: '100vh', width: '100%', ...style }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                whenCreated={onMapReady}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                touchZoom={true}
                dragging={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapUpdater center={center} zoom={zoom} />
                {markers.map((marker, index) => (
                    <AnimatedMarker
                        key={index}
                        position={[marker.position.lat, marker.position.lng]}
                        popup={marker.popup}
                    />
                ))}
                <CustomZoomControl />
                {children}
            </MapContainer>
        </motion.div>
    );
};

export default LeafletMap;
