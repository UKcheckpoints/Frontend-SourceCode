declare namespace H {
    namespace map {
        class Map {
            constructor(element: HTMLElement, baseLayer: H.map.Layer, opt_options?: object);
            dispose(): void;
            getViewModel(): ViewModel;
            addObject(object: object): void;
            getUI(): ui.UI;
            getCore(): service.Platform;
        }
        class Marker {
            constructor(coords: { lat: number; lng: number });
            setData(data: Checkpoint): void;
            getData(): Checkpoint;
            addEventListener(event: string, handler: (evt: mapevents.Event) => void): void;
        }
        class Polyline {
            constructor(lineString: geo.LineString, style?: object);
            getBoundingBox(): geom.Rect;
        }
        class Layer { }
    }
    namespace mapevents {
        class MapEvents {
            constructor(map: map.Map);
        }
        class Behavior {
            constructor(mapEvents: MapEvents);
        }
        interface Event {
            target: map.Marker;
        }
    }
    namespace ui {
        class UI {
            static createDefault(map: map.Map, layers: object): UI;
            addBubble(bubble: InfoBubble): void;
        }
        class InfoBubble {
            constructor(coords: { lat: number; lng: number }, options: object);
            close(): void;
        }
    }
    namespace service {
        class Platform {
            constructor(options: { apikey: string });
            createDefaultLayers(): DefaultLayers;
            getRoutingService(dummy: null, version: number): RoutingService;
        }
        interface DefaultLayers {
            vector: {
                normal: {
                    map: H.map.Layer;
                };
            };
        }
        interface RoutingService {
            calculateRoute(params: object, onResult: (result: RoutingResultResponse) => void, onError: (error: RoutingError) => void): void;
        }
        interface RoutingResultResponse {
            routes: Array<{
                sections: Array<{
                    polyline: string;
                }>;
            }>;
        }
        interface RoutingError {
            message: string;
        }
    }
    namespace geo {
        class LineString {
            static fromFlexiblePolyline(polyline: string): LineString;
        }
    }
    namespace geom {
        class Rect {
            // Add properties as needed
        }
    }
    interface ViewModel {
        setLookAtData(data: { bounds: geom.Rect }): void;
    }
}
