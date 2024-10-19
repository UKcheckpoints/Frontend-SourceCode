"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { MapPin } from 'lucide-react'
import { useToast } from "@/components/ui/UseToast"

type CheckpointData = {
    name: string
    latitude: number
    longitude: number
    status: 'Active' | 'Inactive' | 'Unknown'
}

type Props = {
    onSubmit: (data: CheckpointData) => void
    onCancel: () => void
}

export function AddCheckpointForm({ onSubmit, onCancel }: Props) {
    const { toast } = useToast()
    const [checkpointData, setCheckpointData] = useState<CheckpointData>({
        name: '',
        latitude: 0,
        longitude: 0,
        status: 'Unknown'
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCheckpointData(prev => ({ ...prev, [name]: value }))
    }

    const handleStatusChange = (value: string) => {
        setCheckpointData(prev => ({ ...prev, status: value as CheckpointData['status'] }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(checkpointData)
    }

    const getCurrentLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCheckpointData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }))
                    toast({
                        title: "Location Retrieved",
                        description: "Your current location has been set.",
                        variant: "default",
                    })
                },
                () => {
                    toast({
                        title: "Error",
                        description: "Unable to retrieve your location. Please ensure you've granted permission.",
                        variant: "destructive",
                    })
                }
            )
        } else {
            toast({
                title: "Error",
                description: "Geolocation is not supported by your browser.",
                variant: "destructive",
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={checkpointData.name}
                    onChange={handleChange}
                    required
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={checkpointData.latitude}
                    onChange={handleChange}
                    required
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={checkpointData.longitude}
                    onChange={handleChange}
                    required
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={handleStatusChange} defaultValue={checkpointData.status}>
                    <SelectTrigger className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button
                type="button"
                onClick={getCurrentLocation}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
                <MapPin className="mr-2 h-4 w-4" />
                Get Current Location
            </Button>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel} className="border-blue-500 text-blue-500 hover:bg-blue-50">
                    Cancel
                </Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">Add Checkpoint</Button>
            </div>
        </form>
    )
}