'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import H from '@here/maps-api-for-javascript'
import { MapPin, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

// Replace with your actual HERE API key
const HERE_API_KEY = 'your_here_api_key'

interface Checkpoint {
    id: string
    name: string
    lat: number
    lng: number
}

export default function MapPage() {
    const mapRef = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<H.Map | null>(null)
    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        if (mapRef.current && !map) {
            const platform = new H.service.Platform({
                apikey: HERE_API_KEY
            })

            const defaultLayers = platform.createDefaultLayers()
            const newMap = new H.Map(
                mapRef.current,
                defaultLayers.vector.normal.map,
                {
                    center: { lat: 54.7, lng: -4.2 }, // Center of UK
                    zoom: 6,
                }
            )

            const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap))
            const ui = H.ui.UI.createDefault(newMap, defaultLayers)

            setMap(newMap)

            // Simulated checkpoint data (replace with actual API call)
            const simulatedCheckpoints: Checkpoint[] = [
                { id: '1', name: 'London Checkpoint', lat: 51.5074, lng: -0.1278 },
                { id: '2', name: 'Manchester Checkpoint', lat: 53.4808, lng: -2.2426 },
                { id: '3', name: 'Birmingham Checkpoint', lat: 52.4862, lng: -1.8904 },
                { id: '4', name: 'Edinburgh Checkpoint', lat: 55.9533, lng: -3.1883 },
                { id: '5', name: 'Cardiff Checkpoint', lat: 51.4816, lng: -3.1791 },
            ]

            setCheckpoints(simulatedCheckpoints)
            setLoading(false)

            return () => {
                newMap.dispose()
            }
        }
    }, [mapRef, map])

    useEffect(() => {
        if (map && checkpoints.length > 0) {
            const group = new H.map.Group()

            checkpoints.forEach((checkpoint) => {
                const marker = new H.map.Marker({ lat: checkpoint.lat, lng: checkpoint.lng })
                marker.setData(checkpoint.name)
                group.addObject(marker)
            })

            group.addEventListener('tap', (evt) => {
                const bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
                    content: evt.target.getData()
                })
                map.getViewModel().setLookAtData({
                    position: evt.target.getGeometry(),
                    zoom: 10
                }, true)
                map.addObject(bubble)
            })

            map.addObject(group)
            map.getViewModel().setLookAtData({
                bounds: group.getBoundingBox()
            })
        }
    }, [map, checkpoints])

    const filteredCheckpoints = checkpoints.filter(checkpoint =>
        checkpoint.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 to-sky-200 p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                <Card className="mb-8 bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-gray-900">UK Checkpoints Map</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <Input
                                type="text"
                                placeholder="Search checkpoints..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div ref={mapRef} style={{ height: '500px', width: '100%' }} />
                    </CardContent>
                </Card>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900">Available Checkpoints</h2>
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <Loader2 className="animate-spin h-8 w-8 text-sky-600" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredCheckpoints.map((checkpoint) => (
                                <motion.div
                                    key={checkpoint.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <CardContent className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="h-5 w-5 text-sky-600" />
                                                <h3 className="text-lg font-semibold text-gray-900">{checkpoint.name}</h3>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-600">
                                                Lat: {checkpoint.lat.toFixed(4)}, Lng: {checkpoint.lng.toFixed(4)}
                                            </p>
                                            <Button
                                                className="mt-4 w-full bg-sky-600 hover:bg-sky-700 text-white"
                                                onClick={() => {
                                                    if (map) {
                                                        map.getViewModel().setLookAtData({
                                                            position: { lat: checkpoint.lat, lng: checkpoint.lng },
                                                            zoom: 14
                                                        }, true)
                                                    }
                                                }}
                                            >
                                                View on Map
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    )
}