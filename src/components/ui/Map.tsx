'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, CheckCircle, XCircle, UserPlus, Info, Truck, Route } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Checkpoint {
    id: number
    position: [number, number]
    name: string
    type: 'standard' | 'weigh' | 'inspection'
}

const checkpoints: Checkpoint[] = [
    { id: 1, position: [51.505, -0.09], name: 'London Checkpoint', type: 'standard' },
    { id: 2, position: [53.480, -2.242], name: 'Manchester Checkpoint', type: 'weigh' },
    { id: 3, position: [55.953, -3.188], name: 'Edinburgh Checkpoint', type: 'inspection' },
    { id: 4, position: [52.486, -1.890], name: 'Birmingham Checkpoint', type: 'standard' },
    { id: 5, position: [53.800, -1.549], name: 'Leeds Checkpoint', type: 'weigh' },
    { id: 6, position: [51.454, -2.588], name: 'Bristol Checkpoint', type: 'inspection' },
]

const createIcon = (type: string) => {
    const colors = {
        standard: '#2196F3',
        weigh: '#FFA000',
        inspection: '#4CAF50'
    }
    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: ${colors[type as keyof typeof colors]}; width: 30px; height: 30px; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 15px rgba(0,0,0,0.4);"></div>`,
        iconSize: [30, 30],
    })
}

const AnimatedMarker = motion(Marker)

const AutoZoom: React.FC<{ checkpoints: Checkpoint[] }> = ({ checkpoints }) => {
    const map = useMap()

    useEffect(() => {
        if (map && checkpoints.length > 0) {
            const bounds = L.latLngBounds(checkpoints.map((cp) => cp.position))
            map.fitBounds(bounds, { padding: [50, 50] })
        }
    }, [map, checkpoints])

    return null
}

const MapInteractionHandler: React.FC<{ onInteraction: () => void }> = ({ onInteraction }) => {
    useMapEvents({
        dragend: onInteraction,
        zoomend: onInteraction,
        click: onInteraction,
    })
    return null
}

export default function Map() {
    const [activeCheckpoint, setActiveCheckpoint] = useState<number | null>(null)
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [showSignUp, setShowSignUp] = useState(false)
    const [isMapBlurred, setIsMapBlurred] = useState(false)
    const mapRef = useRef<L.Map | null>(null)
    const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleMarkerClick = useCallback((id: number) => {
        setActiveCheckpoint(id)
    }, [])

    const handleMapInteraction = useCallback(() => {
        if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current)
        }
        interactionTimeoutRef.current = setTimeout(() => {
            setIsMapBlurred(true)
            setShowSignUp(true)
        }, 3000)
    }, [])

    useEffect(() => {
        if (isFirstLoad && mapRef.current) {
            setTimeout(() => {
                setIsFirstLoad(false)
                const randomCheckpoint = checkpoints[Math.floor(Math.random() * checkpoints.length)]
                setActiveCheckpoint(randomCheckpoint.id)
                mapRef.current?.setView(randomCheckpoint.position, 10)
            }, 2000)
        }

        return () => {
            if (interactionTimeoutRef.current) {
                clearTimeout(interactionTimeoutRef.current)
            }
        }
    }, [isFirstLoad])

    const activeCheckpointData = activeCheckpoint ? checkpoints.find((cp) => cp.id === activeCheckpoint) : null

    return (
        <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg border-8 border-white">
            <MapContainer center={[54.5, -4]} zoom={5} className="absolute inset-0 bg-gray-100 transition-all duration-300" style={{ filter: isMapBlurred ? 'blur(5px)' : 'none' }} ref={mapRef}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {checkpoints.map((checkpoint) => (
                    <AnimatedMarker
                        key={checkpoint.id}
                        position={checkpoint.position}
                        icon={createIcon(checkpoint.type)}
                        eventHandlers={{
                            click: () => handleMarkerClick(checkpoint.id),
                        }}
                    >
                        <Popup className="rounded-lg shadow-lg">
                            <div className="p-2">
                                <h3 className="font-bold mb-1">{checkpoint.name}</h3>
                                <Badge variant={checkpoint.type === 'standard' ? 'default' : checkpoint.type === 'weigh' ? 'secondary' : 'destructive'}>
                                    {checkpoint.type.charAt(0).toUpperCase() + checkpoint.type.slice(1)}
                                </Badge>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Status: {activeCheckpoint === checkpoint.id ? 'Active' : 'Inactive'}
                                </p>
                            </div>
                        </Popup>
                    </AnimatedMarker>
                ))}
                {isFirstLoad && <AutoZoom checkpoints={checkpoints} />}
                <MapInteractionHandler onInteraction={handleMapInteraction} />
            </MapContainer>

            <Card className="absolute top-4 right-4 p-4 max-w-[300px] w-full bg-white/90 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <MapPin className="mr-2" size={20} /> Checkpoint Status
                </h3>
                {activeCheckpointData ? (
                    <>
                        <p className="font-medium mb-1">{activeCheckpointData.name}</p>
                        <Badge variant="default" className="flex items-center w-fit">
                            <CheckCircle className="mr-1" size={14} /> Active
                        </Badge>
                    </>
                ) : (
                    <p className="text-muted-foreground flex items-center">
                        <XCircle className="mr-1" size={14} /> No active checkpoint
                    </p>
                )}
            </Card>

            <Card className="absolute bottom-4 left-4 p-4 bg-white/90 backdrop-blur-sm">
                <h4 className="font-semibold mb-2">Legend</h4>
                <div className="space-y-1">
                    <div className="flex items-center">
                        <span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
                        <span className="text-sm">Standard Checkpoint</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-4 h-4 rounded-full bg-amber-500 mr-2"></span>
                        <span className="text-sm">Weigh Station</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                        <span className="text-sm">Inspection Point</span>
                    </div>
                </div>
            </Card>

            <AnimatePresence>
                {showSignUp && (
                    <motion.div
                        className="absolute inset-0 bg-black/70 flex items-center justify-center z-[1000]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Card className="p-6 max-w-md w-full bg-white">
                            <h2 className="text-2xl font-bold mb-4">Unlock Full Access</h2>
                            <p className="mb-6 text-muted-foreground">Sign up now to access advanced features:</p>
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center">
                                    <Truck className="mr-2 text-blue-500" />
                                    <span>Real-time vehicle tracking</span>
                                </div>
                                <div className="flex items-center">
                                    <Route className="mr-2 text-green-500" />
                                    <span>Optimized route planning</span>
                                </div>
                                <div className="flex items-center">
                                    <Info className="mr-2 text-amber-500" />
                                    <span>Detailed checkpoint information</span>
                                </div>
                            </div>
                            <Button className="w-full" size="lg">
                                <UserPlus className="mr-2" size={20} />
                                Sign Up Now
                            </Button>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-4 left-4 bg-white shadow-md"
                            onClick={() => setShowSignUp(true)}
                        >
                            <Info size={20} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Click for more information</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}
