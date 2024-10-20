import React, { useEffect, useRef, useState, useCallback } from 'react';

// Define types for HERE Maps API
declare global {
    interface Window {
        H: typeof H;
        updateStatus: (id: string, status: 'Red' | 'Green' | 'Amber') => void;
    }
}

// Define types for our props and state
type Checkpoint = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    status: 'Red' | 'Green' | 'Amber';
};

type MapComponentProps = {
    apiKey: string;
    initialCenter: { lat: number; lng: number };
    initialZoom: number;
    checkpoints: Checkpoint[];
    onCheckpointStatusChange: (id: string, status: 'Red' | 'Green' | 'Amber') => void;
};

const MapComponent: React.FC<MapComponentProps> = ({
    apiKey,
    initialCenter,
    initialZoom,
    checkpoints,
    onCheckpointStatusChange,
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<H.map.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || !window.H) return;

        const platform = new window.H.service.Platform({ apikey: apiKey });
        const defaultLayers = platform.createDefaultLayers();

        const newMap = new window.H.map.Map(
            mapRef.current,
            (defaultLayers as H.service.DefaultLayers).vector.normal.map,
            {
                center: initialCenter,
                zoom: initialZoom,
            }
        );

        // Add map controls
        window.H.ui.UI.createDefault(newMap, defaultLayers);
        const mapEvents = new window.H.mapevents.MapEvents(newMap);
        new window.H.mapevents.Behavior(mapEvents);

        setMap(newMap);

        return () => {
            newMap.dispose();
        };
    }, [apiKey, initialCenter, initialZoom]);

    const showCheckpointInfo = useCallback((checkpoint: Checkpoint) => {
        if (!map) return;

        const bubble = new window.H.ui.InfoBubble(
            { lat: checkpoint.lat, lng: checkpoint.lng },
            {
                content: `
          <div>
            <h3>${checkpoint.name}</h3>
            <p>Status: ${checkpoint.status}</p>
            <button onclick="window.updateStatus('${checkpoint.id}', 'Red')">Red</button>
            <button onclick="window.updateStatus('${checkpoint.id}', 'Green')">Green</button>
            <button onclick="window.updateStatus('${checkpoint.id}', 'Amber')">Amber</button>
          </div>
        `,
            }
        );

        // Add the info bubble to the UI
        map.getUI().addBubble(bubble);

        // Define the updateStatus function
        window.updateStatus = (id: string, status: 'Red' | 'Green' | 'Amber') => {
            onCheckpointStatusChange(id, status);
            bubble.close();
        };
    }, [map, onCheckpointStatusChange]);

    useEffect(() => {
        if (!map) return;

        // Add checkpoints to the map
        checkpoints.forEach((checkpoint) => {
            const marker = new window.H.map.Marker({ lat: checkpoint.lat, lng: checkpoint.lng });
            marker.setData(checkpoint);
            map.addObject(marker);

            // Add click event to markers
            marker.addEventListener('tap', (evt: H.mapevents.Event) => {
                const target = evt.target as H.map.Marker;
                const checkpointData = target.getData() as Checkpoint;
                showCheckpointInfo(checkpointData);
            });
        });
    }, [map, checkpoints, showCheckpointInfo]);

    const planRoute = (start: { lat: number; lng: number }, end: { lat: number; lng: number }) => {
        if (!map) return;

        const router = (map.getCore() as H.service.Platform).getRoutingService(null, 8);

        const routeParams = {
            routingMode: 'fast',
            transportMode: 'truck',
            origin: `${start.lat},${start.lng}`,
            destination: `${end.lat},${end.lng}`,
            return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
        };

        router.calculateRoute(routeParams, (result: H.service.RoutingResultResponse) => {
            if (result.routes.length) {
                const newRoute = result.routes[0];

                // Create a polyline for the route
                const routeShape = window.H.geo.LineString.fromFlexiblePolyline(newRoute.sections[0].polyline);
                const routeLine = new window.H.map.Polyline(routeShape, {
                    style: { strokeColor: 'blue', lineWidth: 3 }
                });

                // Add the route polyline to the map
                map.addObject(routeLine);

                // Zoom the map to the route
                map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
            }
        }, (error: H.service.RoutingError) => {
            console.error('Routing error:', error);
        });
    };

    return (
        <div className="map-container" style={{ width: '100%', height: '500px', position: 'relative' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            <div className="map-controls" style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
                <button onClick={() => planRoute({ lat: 51.5074, lng: -0.1278 }, { lat: 55.9533, lng: -3.1883 })}>
                    Plan Route (London to Edinburgh)
                </button>
            </div>
        </div>
    );
};

export default MapComponent;