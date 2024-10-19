import React, { useContext, useEffect } from 'react';
import { MapContext } from '@/components/layout/Map';

interface MarkerProps {
    lat: number;
    lng: number;
}

const Marker: React.FC<MarkerProps> = ({ lat, lng }) => {
    const { map } = useContext(MapContext);

    useEffect(() => {
        if (map) {
            const marker = new H.map.Marker({ lat, lng });
            map.addObject(marker);

            return () => {
                map.removeObject(marker);
            };
        }
    }, [map, lat, lng]);

    return null;
};

export default Marker;