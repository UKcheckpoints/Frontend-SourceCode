"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { AlertCircle, Check, MapPin, Truck } from 'lucide-react'
import { useToast } from "@/components/ui/UseToast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog"

// Replace this with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyBNRvZ-EfsEeTC69S2DW8BYDs2ZIpPVy3g'

interface LatLng {
    lat: number
    lng: number
}

interface Checkpoint {
    id: number
    name: string
    position: LatLng
    status: 'Red' | 'Amber' | 'Green'
}

interface CheckpointStatus {
    color: string
    icon: React.ReactNode
}

const mapContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '100vh',
}

const center: LatLng = {
    lat: 54.5,
    lng: -4,
}

const vehicleTypes = ['Car', 'Van', 'Truck', 'HGV'] as const
type VehicleType = typeof vehicleTypes[number]

const checkpointStatuses: Record<Checkpoint['status'], CheckpointStatus> = {
    Red: { color: 'bg-red-500', icon: <AlertCircle className="w-4 h-4" /> },
    Amber: { color: 'bg-yellow-500', icon: <AlertCircle className="w-4 h-4" /> },
    Green: { color: 'bg-green-500', icon: <Check className="w-4 h-4" /> },
}

export default function UKCheckpointsMap() {
    const [map, setMap] = useState<google.maps.Map | null>(null)
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null)
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)
    const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null)
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('Car')
    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
    const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null)
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([])
    const [selectedRoute, setSelectedRoute] = useState<google.maps.DirectionsRoute | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isGeolocationDialogOpen, setIsGeolocationDialogOpen] = useState(false)
    const { toast } = useToast()

    const locationUpdateInterval = useRef<NodeJS.Timeout | null>(null)

    const fetchCheckpoints = useCallback(async () => {
        // Replace this with actual API call
        const mockCheckpoints: Checkpoint[] = [
            { id: 1, name: 'Checkpoint A', position: { lat: 55.0, lng: -2.0 }, status: 'Green' },
            { id: 2, name: 'Checkpoint B', position: { lat: 54.0, lng: -3.0 }, status: 'Amber' },
            { id: 3, name: 'Checkpoint C', position: { lat: 53.0, lng: -4.0 }, status: 'Red' },
        ]
        setCheckpoints(mockCheckpoints)
    }, [])

    const updateUserLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                },
                (error) => {
                    console.error('Error getting current location:', error)
                    toast({
                        title: "Location Error",
                        description: "Unable to get your current location. Please check your settings and try again.",
                        variant: "destructive",
                    })
                }
            )
        } else {
            toast({
                title: "Geolocation Unavailable",
                description: "Your browser doesn't support geolocation. Some features may be limited.",
                variant: "destructive",
            })
        }
    }, [toast])

    useEffect(() => {
        fetchCheckpoints()

        if (!navigator.permissions) {
            updateUserLocation()
            return
        }

        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            if (result.state === 'granted') {
                updateUserLocation()
            } else if (result.state === 'prompt') {
                setIsGeolocationDialogOpen(true)
            } else {
                toast({
                    title: "Location Permission Denied",
                    description: "You've denied location access. Some features may be limited.",
                    variant: "destructive",
                })
            }
        })

        return () => {
            if (locationUpdateInterval.current) {
                clearInterval(locationUpdateInterval.current)
            }
        }
    }, [fetchCheckpoints, updateUserLocation, toast])

    const onMapLoad = useCallback((map: google.maps.Map) => {
        setMap(map)
        setDirectionsService(new window.google.maps.DirectionsService())
        setDirectionsRenderer(new window.google.maps.DirectionsRenderer())
    }, [])

    const handleVehicleChange = useCallback((value: string) => {
        setSelectedVehicle(value as VehicleType)
    }, [])

    const handleCheckpointClick = useCallback((checkpoint: Checkpoint) => {
        setSelectedCheckpoint(checkpoint)
    }, [])

    const handleStatusUpdate = useCallback((newStatus: Checkpoint['status']) => {
        setCheckpoints((prevCheckpoints) =>
            prevCheckpoints.map((cp) =>
                cp.id === selectedCheckpoint?.id ? { ...cp, status: newStatus } : cp
            )
        )
        setSelectedCheckpoint(null)
        toast({
            title: "Status Updated",
            description: `Checkpoint status has been updated to ${newStatus}.`,
            variant: "default"
        })
    }, [selectedCheckpoint, toast])

    const handleRouteSearch = useCallback(() => {
        if (!currentLocation || checkpoints.length === 0 || !directionsService || !directionsRenderer || !map) return

        const waypoints = checkpoints.map((checkpoint) => ({
            location: checkpoint.position,
            stopover: true,
        }))

        directionsService.route(
            {
                origin: currentLocation,
                destination: currentLocation,
                waypoints: waypoints,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === 'OK' && result) {
                    setRoutes(result.routes)
                    setSelectedRoute(result.routes[0])
                    directionsRenderer.setDirections(result)
                    directionsRenderer.setMap(map)
                } else {
                    toast({
                        title: "Route Error",
                        description: "Unable to calculate the route. Please try again.",
                        variant: "destructive",
                    })
                }
            }
        )
    }, [currentLocation, checkpoints, directionsService, directionsRenderer, map, toast])

    const handleRouteSelect = useCallback((index: number) => {
        if (!directionsRenderer) return
        setSelectedRoute(routes[index])
        directionsRenderer.setRouteIndex(index)
    }, [routes, directionsRenderer])

    const filteredCheckpoints = useMemo(() =>
        checkpoints.filter((checkpoint) =>
            checkpoint.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [checkpoints, searchQuery]
    )

    const handleGeolocationPermission = useCallback(() => {
        setIsGeolocationDialogOpen(false)
        updateUserLocation()
        locationUpdateInterval.current = setInterval(updateUserLocation, 5000)
    }, [updateUserLocation])

    return (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} loadingElement={<div>Loading...</div>}>
            <div className="relative w-full h-screen">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={6}
                    onLoad={onMapLoad}
                >
                    {currentLocation && (
                        <Marker
                            position={currentLocation}
                            icon={{
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 7,
                                fillColor: '#4299E1',
                                fillOpacity: 1,
                                strokeWeight: 2,
                                strokeColor: '#FFFFFF',
                            }}
                        />
                    )}
                    {filteredCheckpoints.map((checkpoint) => (
                        <Marker
                            key={checkpoint.id}
                            position={checkpoint.position}
                            onClick={() => handleCheckpointClick(checkpoint)}
                            icon={{
                                path: MapPin.toString(),
                                fillColor: checkpointStatuses[checkpoint.status].color,
                                fillOpacity: 1,
                                strokeWeight: 1,
                                strokeColor: '#FFFFFF',
                                scale: 1.5,
                            }}
                        />
                    ))}
                    {selectedCheckpoint && (
                        <InfoWindow
                            position={selectedCheckpoint.position}
                            onCloseClick={() => setSelectedCheckpoint(null)}
                        >
                            <div>
                                <h3 className="font-bold">{selectedCheckpoint.name}</h3>
                                <p>Status: {selectedCheckpoint.status}</p>
                                <div className="flex gap-2 mt-2">
                                    {(Object.keys(checkpointStatuses) as Array<keyof typeof checkpointStatuses>).map((status) => (
                                        <Button
                                            key={status}
                                            size="sm"
                                            onClick={() => handleStatusUpdate(status)}
                                            className={`${checkpointStatuses[status].color} text-white`}
                                        >
                                            {status}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
                <Card className="absolute top-4 left-4 w-80 md:w-96 bg-white/80 backdrop-blur-sm shadow-lg">
                    <CardHeader>
                        <CardTitle>UK Checkpoints Route Planner</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Select value={selectedVehicle} onValueChange={handleVehicleChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select vehicle type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vehicleTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                type="text"
                                placeholder="Search checkpoints..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button onClick={handleRouteSearch} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Truck className="mr-2 h-4 w-4" /> Plan Route
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                {routes.length > 0 && (
                    <Card className="absolute bottom-4 left-4 w-80 md:w-96 bg-white/80 backdrop-blur-sm shadow-lg">
                        <CardHeader>
                            <CardTitle>Available Routes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {routes.map((route, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => handleRouteSelect(index)}
                                        className={`w-full ${selectedRoute === route ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                                            }`}
                                    >
                                        Route {index + 1}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
                <div className="absolute top-4 right-4 space-y-2">
                    {Object.entries(checkpointStatuses).map(([status, { color, icon }]) => (
                        <Badge key={status} className={`${color} text-white`}>
                            {icon}
                            <span className="ml-1">{status}</span>
                        </Badge>
                    ))}
                </div>
            </div>
            <Dialog open={isGeolocationDialogOpen} onOpenChange={setIsGeolocationDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enable Location Services</DialogTitle>
                        <DialogDescription>
                            This app uses your location to provide better route planning. Would you like to enable location services?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsGeolocationDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleGeolocationPermission}>Enable Location</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </LoadScript>
    )
}