'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Search, RefreshCcw, MapPin, Truck, Route as RouteIcon, LogOut, Plus, Navigation } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Textarea } from "@/components/ui/Textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { toast, Toaster } from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useJwtValidator } from '@/lib/hooks/useJwtValidator'
import { debounce } from 'lodash'

// Icon creation function (unchanged)
const createIcon = (color: string) => new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
})

const activeIcon = createIcon('#4ade80')
const inactiveIcon = createIcon('#f87171')
const unknownIcon = createIcon('#fbbf24')
const userIcon = createIcon('#3b82f6')

// Interfaces (unchanged)
interface CheckpointPOI {
    id: bigint
    name: string
    status: 'ACTIVE' | 'INACTIVE' | 'UNKNOWN'
    latitude: number
    longitude: number
    lastUpdated: Date
    statusUpdatedById: bigint
    comment?: string
}

interface Vehicle {
    id: string
    make: string
    model: string
    year: number
    type: string
    weight: number
}

interface Route {
    id: string
    name: string
    checkpoints: CheckpointPOI[]
    distance: number
    duration: number
}

interface SearchResult {
    name: string
    latitude: number
    longitude: number
}

interface SearchLocationResult {
    display_name: string
    latitude: string
    longitude: string
}

// Map update component (unchanged)
const MapUpdater: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
    const map = useMap()
    useEffect(() => {
        map.setView(center, zoom)
    }, [center, zoom, map])
    return null
}

// User location marker component (unchanged)
const UserLocationMarker: React.FC<{ position: [number, number] }> = ({ position }) => {
    const map = useMap()

    useEffect(() => {
        map.flyTo(position, map.getZoom())
    }, [map, position])

    return (
        <Marker position={position} icon={userIcon}>
            <Popup>Your current location</Popup>
        </Marker>
    )
}

export default function CheckpointMap() {
    const [mapCenter, setMapCenter] = useState<[number, number]>([51.5074, -0.1278])
    const [mapZoom, setMapZoom] = useState(13)
    const [checkpointSearchQuery, setCheckpointSearchQuery] = useState('')
    const [locationSearchQuery, setLocationSearchQuery] = useState('')
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
    const [checkpoints, setCheckpoints] = useState<CheckpointPOI[]>([])
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [routes, setRoutes] = useState<Route[]>([])
    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
    const [newPOI, setNewPOI] = useState<Partial<CheckpointPOI>>({})
    const [startPoint, setStartPoint] = useState<SearchResult | null>(null)
    const [endPoint, setEndPoint] = useState<SearchResult | null>(null)
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])

    const router = useRouter()
    const { isValid, isLoadingState, logout } = useJwtValidator()

    const api = process.env.NEXT_PUBLIC_API_URL

    const fetchCheckpoints = useCallback(async () => {
        try {
            const response = await axios.get(`${api}/map/pois`, { withCredentials: true })
            setCheckpoints(response.data)
            toast.success('Checkpoints updated successfully')
        } catch (error) {
            console.error('Error fetching checkpoints:', error)
            toast.error('Failed to fetch checkpoints')
        }
    }, [api])

    const fetchVehicles = useCallback(async (query: string) => {
        try {
            const response = await axios.get<{ make: string; model: string; year: number; type?: string; weight?: number }[]>(
                `https://api.api-ninjas.com/v1/cars?limit=10&model=${query}`,
                {
                    headers: { 'X-Api-Key': process.env.NEXT_PUBLIC_NINJA_API_KEY }
                }
            )
            setVehicles(response.data.map((car, index) => ({
                id: `${index}-${car.make}-${car.model}`,
                make: car.make,
                model: car.model,
                year: car.year,
                type: car.type || 'Unknown',
                weight: car.weight || 0
            })))
        } catch (error) {
            console.error('Error fetching vehicles:', error)
            toast.error('Failed to fetch vehicles')
        }
    }, [])

    useEffect(() => {
        if (isValid) {
            fetchCheckpoints()
        } else if (!isLoadingState) {
            router.push('/login')
        }
    }, [isValid, isLoadingState, fetchCheckpoints, router])

    useEffect(() => {
        const fetchIPLocation = async () => {
            try {
                const response = await axios.get('https://ipapi.co/json/')
                setUserLocation([response.data.latitude, response.data.longitude])
            } catch (error) {
                console.error('Error fetching IP location:', error)
                toast.error('Failed to get your location')
            }
        }

        fetchIPLocation()
    }, [])

    const handleCheckpointSearch = () => {
        const checkpoint = checkpoints.find(cp => cp.name.toLowerCase().includes(checkpointSearchQuery.toLowerCase()))
        if (checkpoint) {
            setMapCenter([checkpoint.latitude, checkpoint.longitude])
            setMapZoom(15)
        } else {
            toast.error('Checkpoint not found')
        }
    }

    const handleStatusUpdate = async (id: bigint, status: 'ACTIVE' | 'INACTIVE' | 'UNKNOWN', comment: string) => {
        try {
            const response = await axios.put(`${api}/map/pois/${id}/status`, { status, comment }, { withCredentials: true })
            setCheckpoints(checkpoints.map(cp => cp.id === id ? response.data : cp))
            toast.success('Checkpoint status updated successfully')
        } catch (error) {
            console.error('Error updating checkpoint status:', error)
            toast.error('Failed to update checkpoint status')
        }
    }

    const handleCreatePOI = async () => {
        try {
            const response = await axios.post(`${api}/map/pois`, newPOI, { withCredentials: true })
            setCheckpoints([...checkpoints, response.data])
            toast.success('New checkpoint created successfully')
            setNewPOI({})
        } catch (error) {
            console.error('Error creating new checkpoint:', error)
            toast.error('Failed to create new checkpoint')
        }
    }

    const handleGetCurrentLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    setUserLocation([latitude, longitude])
                    setMapCenter([latitude, longitude])
                    setMapZoom(15)
                    toast.success('Current location updated')
                },
                (error) => {
                    console.error('Error getting current location:', error)
                    toast.error('Failed to get current location')
                }
            )
        } else {
            toast.error('Geolocation is not supported by your browser')
        }
    }

    const planRoute = async () => {
        if (!startPoint || !endPoint) {
            toast.error('Please select start and end points')
            return
        }

        try {
            const vehicle = selectedVehicle || { type: 'car', weight: 0 } // Default to car if no vehicle selected
            const response = await axios.post(`${api}/map/route`, {
                start: [startPoint.latitude, startPoint.longitude],
                end: [endPoint.latitude, endPoint.longitude],
                vehicleType: vehicle.type,
                vehicleWeight: vehicle.weight
            }, { withCredentials: true })

            const newRoute: Route = {
                id: `route-${Date.now()}`,
                name: `${startPoint.name} to ${endPoint.name}`,
                checkpoints: response.data.waypoints,
                distance: response.data.distance,
                duration: response.data.duration
            }

            setRoutes([...routes, newRoute])
            setSelectedRoute(newRoute)
            toast.success('Route planned successfully')
        } catch (error) {
            console.error('Error planning route:', error)
            toast.error('Failed to plan route')
        }
    }

    const handleLocationSearch = useCallback(async (query: string, setPoint: (point: SearchResult | null) => void) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
            const results: SearchResult[] = response.data.map((result: SearchLocationResult) => ({
                name: result.display_name,
                latitude: parseFloat(result.latitude),
                longitude: parseFloat(result.longitude)
            }))
            setSearchResults(results)
            if (results.length > 0) {
                setPoint(results[0])
                setMapCenter([results[0].latitude, results[0].longitude])
                setMapZoom(15)
            } else {
                toast.error('No results found')
            }
        } catch (error) {
            console.error('Error searching location:', error)
            toast.error('Failed to search location')
        }
    }, [])

    const debouncedLocationSearch = useMemo(
        () => debounce((query: string, setPoint: (point: SearchResult | null) => void) => handleLocationSearch(query, setPoint), 300),
        [handleLocationSearch]
    )

    if (!isValid && !isLoadingState) {
        return null
    }

    return (
        <div className="h-screen flex flex-col bg-gradient-to-b from-sky-100 to-white">
            <header className="bg-sky-500 text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-3xl font-bold">UKcheckpoints</h1>
                <Button onClick={logout} variant="ghost" className="text-white hover:text-sky-200">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </header>
            <main className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
                <Card className="w-full lg:w-1/3 xl:w-1/4 bg-white shadow-lg z-10 rounded-xl border border-sky-100 overflow-y-auto">
                    <CardHeader className="bg-sky-50 rounded-t-xl sticky top-0 z-10">
                        <CardTitle className="text-2xl font-bold text-sky-800">Control Panel</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <Tabs defaultValue="routes" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-4">
                                <TabsTrigger value="routes" className="text-sky-700">
                                    <RouteIcon className="w-4 h-4 mr-2" />
                                    Routes
                                </TabsTrigger>
                                <TabsTrigger value="checkpoints" className="text-sky-700">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Checkpoints
                                </TabsTrigger>
                                <TabsTrigger value="vehicles" className="text-sky-700">
                                    <Truck className="w-4 h-4 mr-2" />
                                    Vehicles
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="routes">
                                <div className="space-y-4">
                                    <Card className="bg-sky-50 border border-sky-200">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg font-semibold text-sky-800">Plan a Route</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="start-point" className="block text-sm font-medium text-sky-700 mb-1">Start Point</label>
                                                    <div className="flex space-x-2">
                                                        <Input
                                                            id="start-point"
                                                            type="text"
                                                            placeholder="Enter start location"
                                                            value={startPoint?.name || ''}
                                                            onChange={(e) => {
                                                                const query = e.target.value
                                                                setStartPoint({ ...startPoint, name: query } as SearchResult)
                                                                debouncedLocationSearch(query, setStartPoint)
                                                            }}
                                                            className="flex-grow"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="end-point" className="block text-sm font-medium text-sky-700 mb-1">End Point</label>
                                                    <div className="flex space-x-2">
                                                        <Input
                                                            id="end-point"
                                                            type="text"
                                                            placeholder="Enter destination"
                                                            value={endPoint?.name || ''}
                                                            onChange={(e) => {
                                                                const query = e.target.value
                                                                setEndPoint({ ...endPoint, name: query } as SearchResult)
                                                                debouncedLocationSearch(query, setEndPoint)
                                                            }}
                                                            className="flex-grow"
                                                        />
                                                    </div>
                                                </div>
                                                {searchResults.length > 0 && (
                                                    <div className="mt-2">
                                                        <h3 className="text-sm font-semibold text-sky-700 mb-1">Suggestions:</h3>
                                                        <ul className="space-y-1">
                                                            {searchResults.map((result, index) => (
                                                                <li key={index}>
                                                                    <Button
                                                                        variant="ghost"
                                                                        className="w-full text-left text-sm text-sky-600 hover:text-sky-800"
                                                                        onClick={() => {
                                                                            if (startPoint && !startPoint.latitude) {
                                                                                setStartPoint(result)
                                                                            } else if (endPoint && !endPoint.latitude) {
                                                                                setEndPoint(result)
                                                                            }
                                                                            setSearchResults([])
                                                                        }}
                                                                    >
                                                                        {result.name}
                                                                    </Button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                <Button onClick={planRoute} className="w-full bg-sky-500 hover:bg-sky-600 text-white">
                                                    <RouteIcon className="mr-2 h-4 w-4" />
                                                    Plan Route
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    {selectedRoute && (
                                        <Card className="mt-4 bg-sky-50 border border-sky-200">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg font-semibold text-sky-800">Route Details</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sky-700">From: <span className="font-medium">{startPoint?.name}</span></p>
                                                <p className="text-sky-700">To: <span className="font-medium">{endPoint?.name}</span></p>
                                                <p className="text-sky-700">Distance: <span className="font-medium">{selectedRoute.distance.toFixed(2)} km</span></p>
                                                <p className="text-sky-700">Duration: <span className="font-medium">{Math.round(selectedRoute.duration / 60)} minutes</span></p>
                                                <p className="text-sky-700">Checkpoints: <span className="font-medium">{selectedRoute.checkpoints.length}</span></p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="checkpoints">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="checkpoint-search" className="block text-sm font-medium text-sky-700 mb-1">Search Checkpoints</label>
                                        <div className="flex">
                                            <Input
                                                id="checkpoint-search"
                                                type="text"
                                                placeholder="Enter checkpoint name"
                                                value={checkpointSearchQuery}
                                                onChange={(e) => setCheckpointSearchQuery(e.target.value)}
                                                className="flex-1 mr-2 border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            <Button onClick={handleCheckpointSearch} className="bg-sky-500 hover:bg-sky-600 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2">
                                                <Search className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={fetchCheckpoints}
                                        className="w-full bg-sky-500 hover:bg-sky-600 focus:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                                    >
                                        <RefreshCcw className="mr-2 h-4 w-4" />
                                        Refresh Checkpoints
                                    </Button>
                                    <Card className="mt-4 bg-sky-50 border border-sky-200">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg font-semibold text-sky-800">Create New Checkpoint</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Input
                                                placeholder="Name"
                                                value={newPOI.name || ''}
                                                onChange={(e) => setNewPOI({ ...newPOI, name: e.target.value })}
                                                className="mb-2"
                                            />
                                            <Input
                                                placeholder="Latitude"
                                                type="number"
                                                value={newPOI.latitude || ''}
                                                onChange={(e) => setNewPOI({ ...newPOI, latitude: parseFloat(e.target.value) })}
                                                className="mb-2"
                                            />
                                            <Input
                                                placeholder="Longitude"
                                                type="number"
                                                value={newPOI.longitude || ''}
                                                onChange={(e) => setNewPOI({ ...newPOI, longitude: parseFloat(e.target.value) })}
                                                className="mb-2"
                                            />
                                            <Select onValueChange={(value: 'ACTIVE' | 'INACTIVE' | 'UNKNOWN') => setNewPOI({ ...newPOI, status: value })}>
                                                <SelectTrigger className="w-full mb-2">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                    <SelectItem value="UNKNOWN">Unknown</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Textarea
                                                placeholder="Comment"
                                                value={newPOI.comment || ''}
                                                onChange={(e) => setNewPOI({ ...newPOI, comment: e.target.value })}
                                                className="mb-2"
                                            />
                                            <Button onClick={handleCreatePOI} className="w-full bg-sky-500 hover:bg-sky-600 text-white">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Create Checkpoint
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                            <TabsContent value="vehicles">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="vehicle-search" className="block text-sm font-medium text-sky-700 mb-1">Search Vehicles</label>
                                        <div className="flex">
                                            <Input
                                                id="vehicle-search"
                                                type="text"
                                                placeholder="Enter vehicle model"
                                                onChange={(e) => fetchVehicles(e.target.value)}
                                                className="flex-1 mr-2 border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            <Button onClick={() => fetchVehicles('')} className="bg-sky-500 hover:bg-sky-600 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2">
                                                <Search className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <Select onValueChange={(value) => setSelectedVehicle(vehicles.find(v => v.id === value) || null)}>
                                        <SelectTrigger className="w-full border-sky-200 focus:border-sky-500 focus:ring-sky-500">
                                            <SelectValue placeholder="Select a vehicle" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            {vehicles.map((vehicle) => (
                                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                                    {`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedVehicle && (
                                        <Card className="mt-4 bg-sky-50 border border-sky-200">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg font-semibold text-sky-800">Selected Vehicle</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sky-700">Make: <span className="font-medium">{selectedVehicle.make}</span></p>
                                                <p className="text-sky-700">Model: <span className="font-medium">{selectedVehicle.model}</span></p>
                                                <p className="text-sky-700">Year: <span className="font-medium">{selectedVehicle.year}</span></p>
                                                <p className="text-sky-700">Type: <span className="font-medium">{selectedVehicle.type}</span></p>
                                                <p className="text-sky-700">Weight: <span className="font-medium">{selectedVehicle.weight} kg</span></p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
                <div className="flex-1 relative h-full">
                    <div className="absolute top-4 left-4 right-4 z-[1000] bg-white rounded-lg shadow-md p-2">
                        <div className="flex items-center space-x-2">
                            <Input
                                type="text"
                                placeholder="Search for a location"
                                value={locationSearchQuery}
                                onChange={(e) => {
                                    setLocationSearchQuery(e.target.value)
                                    debouncedLocationSearch(e.target.value, () => { })
                                }}
                                className="flex-grow"
                            />
                            <Button onClick={() => handleLocationSearch(locationSearchQuery, () => { })} className="bg-sky-500 hover:bg-sky-600 text-white">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: 'calc(100vh - 8rem)', width: '100%' }} className="rounded-lg shadow-md">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MapUpdater center={mapCenter} zoom={mapZoom} />
                        {userLocation && (
                            <UserLocationMarker position={userLocation} />
                        )}
                        {checkpoints.map((checkpoint) => (
                            <Marker
                                key={checkpoint.id.toString()}
                                position={[checkpoint.latitude, checkpoint.longitude]}
                                icon={checkpoint.status === 'ACTIVE' ? activeIcon : checkpoint.status === 'INACTIVE' ? inactiveIcon : unknownIcon}
                            >
                                <Popup>
                                    <Card className="w-64 border-none shadow-none">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">{checkpoint.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <p className="text-sm font-medium">Status: <span className={`${checkpoint.status === 'ACTIVE' ? 'text-green-500' : checkpoint.status === 'INACTIVE' ? 'text-red-500' : 'text-yellow-500'}`}>{checkpoint.status}</span></p>
                                            <p className="text-xs text-gray-500">Last Updated: {new Date(checkpoint.lastUpdated).toLocaleString()}</p>
                                            <Select
                                                onValueChange={(value: 'ACTIVE' | 'INACTIVE' | 'UNKNOWN') => {
                                                    handleStatusUpdate(checkpoint.id, value, checkpoint.comment || '')
                                                }}
                                                defaultValue={checkpoint.status}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Update status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                    <SelectItem value="UNKNOWN">Unknown</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Textarea
                                                placeholder="Add a comment"
                                                className="w-full text-sm"
                                                defaultValue={checkpoint.comment}
                                                onChange={(e) => {
                                                    const updatedCheckpoint = { ...checkpoint, comment: e.target.value }
                                                    setCheckpoints(checkpoints.map(cp => cp.id === checkpoint.id ? updatedCheckpoint : cp))
                                                }}
                                            />
                                            <Button
                                                className="w-full text-sm bg-sky-500 hover:bg-sky-600 text-white"
                                                onClick={() => handleStatusUpdate(checkpoint.id, checkpoint.status, checkpoint.comment || '')}
                                            >
                                                Save Changes
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Popup>
                            </Marker>
                        ))}
                        {selectedRoute && (
                            <Polyline
                                positions={selectedRoute.checkpoints.map(cp => [cp.latitude, cp.longitude])}
                                color="#3b82f6"
                                weight={3}
                                opacity={0.7}
                            />
                        )}
                    </MapContainer>
                    <Button
                        onClick={handleGetCurrentLocation}
                        className="absolute bottom-4 right-4 bg-sky-500 hover:bg-sky-600 text-white z-[1000]"
                    >
                        <Navigation className="mr-2 h-4 w-4" />
                        Get Current Location
                    </Button>
                </div>
            </main>
            <Toaster position="top-right" />
        </div>
    )
}