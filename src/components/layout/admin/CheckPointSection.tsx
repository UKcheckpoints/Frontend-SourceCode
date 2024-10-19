"use client"

import React, { useState, useMemo } from 'react'
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { MapPin, Calendar, User, Trash2, ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { AddCheckpointForm } from '@/components/layout/AddCheckPointForm'

type Checkpoint = {
    id: string
    name: string
    latitude: number
    longitude: number
    status: 'Active' | 'Inactive' | 'Unknown'
    lastUpdateTime: string
    lastUpdateUser: string
}

type Props = {
    isSuperAdmin: boolean
}

// Mock data for checkpoints
const mockCheckpoints: Checkpoint[] = [
    {
        id: '1',
        name: 'Checkpoint Alpha',
        latitude: 40.7128,
        longitude: -74.0060,
        status: 'Active',
        lastUpdateTime: '2023-10-15 14:30',
        lastUpdateUser: 'John Doe'
    },
    {
        id: '2',
        name: 'Checkpoint Beta',
        latitude: 34.0522,
        longitude: -118.2437,
        status: 'Inactive',
        lastUpdateTime: '2023-10-14 09:15',
        lastUpdateUser: 'Jane Smith'
    },
    {
        id: '3',
        name: 'Checkpoint Gamma',
        latitude: 51.5074,
        longitude: -0.1278,
        status: 'Unknown',
        lastUpdateTime: '2023-10-13 18:45',
        lastUpdateUser: 'Alice Johnson'
    }
]

export function CheckpointManagementContent({ isSuperAdmin }: Props) {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [checkpointsPerPage, setCheckpointsPerPage] = useState(10)
    const [checkpoints, setCheckpoints] = useState(mockCheckpoints)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; checkpointId: string | null }>({
        isOpen: false,
        checkpointId: null
    })

    const filteredCheckpoints = useMemo(() => {
        return checkpoints.filter(checkpoint =>
            checkpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            checkpoint.status.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [checkpoints, searchTerm])

    const totalPages = Math.ceil(filteredCheckpoints.length / checkpointsPerPage)

    const currentCheckpoints = useMemo(() => {
        const indexOfLastCheckpoint = currentPage * checkpointsPerPage
        const indexOfFirstCheckpoint = indexOfLastCheckpoint - checkpointsPerPage
        return filteredCheckpoints.slice(indexOfFirstCheckpoint, indexOfLastCheckpoint)
    }, [currentPage, checkpointsPerPage, filteredCheckpoints])

    const handleStatusChange = (checkpointId: string, newStatus: Checkpoint['status']) => {
        setCheckpoints(prevCheckpoints =>
            prevCheckpoints.map(checkpoint =>
                checkpoint.id === checkpointId
                    ? { ...checkpoint, status: newStatus, lastUpdateTime: new Date().toLocaleString(), lastUpdateUser: 'Current User' }
                    : checkpoint
            )
        )
    }

    const handleDeleteCheckpoint = (checkpointId: string) => {
        setDeleteConfirmation({ isOpen: true, checkpointId })
    }

    const confirmDeleteCheckpoint = () => {
        if (deleteConfirmation.checkpointId) {
            setCheckpoints(prevCheckpoints =>
                prevCheckpoints.filter(checkpoint => checkpoint.id !== deleteConfirmation.checkpointId)
            )
        }
        setDeleteConfirmation({ isOpen: false, checkpointId: null })
    }

    const handleAddCheckpoint = (newCheckpoint: Omit<Checkpoint, 'id' | 'lastUpdateTime' | 'lastUpdateUser'>) => {
        const checkpoint: Checkpoint = {
            id: Date.now().toString(),
            ...newCheckpoint,
            lastUpdateTime: new Date().toLocaleString(),
            lastUpdateUser: 'Current User'
        }
        setCheckpoints(prevCheckpoints => [...prevCheckpoints, checkpoint])
        setIsAddDialogOpen(false)
    }

    return (
        <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="bg-sky-100 border-b border-sky-200">
                <CardTitle className="text-3xl font-bold text-sky-800">Checkpoint Management</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search checkpoints..."
                            className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select
                        value={checkpointsPerPage.toString()}
                        onValueChange={(value) => setCheckpointsPerPage(Number(value))}
                    >
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Checkpoints per page" />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                            <SelectItem value="5">5 per page</SelectItem>
                            <SelectItem value="10">10 per page</SelectItem>
                            <SelectItem value="20">20 per page</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Checkpoint
                    </Button>
                </div>
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordinates</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Update</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated By</TableHead>
                                {isSuperAdmin && <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentCheckpoints.map((checkpoint) => (
                                <TableRow key={checkpoint.id} className="transition-colors hover:bg-gray-100">
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                                            <div className="text-sm font-medium text-gray-900">{checkpoint.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{checkpoint.latitude.toFixed(4)}, {checkpoint.longitude.toFixed(4)}</div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <Select
                                            onValueChange={(value) => handleStatusChange(checkpoint.id, value as Checkpoint['status'])}
                                            defaultValue={checkpoint.status}
                                        >
                                            <SelectTrigger className="w-[120px]">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent className='bg-white'>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Inactive">Inactive</SelectItem>
                                                <SelectItem value="Unknown">Unknown</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                            <span>{checkpoint.lastUpdateTime}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-500">{checkpoint.lastUpdateUser}</span>
                                        </div>
                                    </TableCell>
                                    {isSuperAdmin && (
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteCheckpoint(checkpoint.id)}
                                                className="text-red-600 hover:text-red-900 hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {(currentPage - 1) * checkpointsPerPage + 1} to {Math.min(currentPage * checkpointsPerPage, filteredCheckpoints.length)} of {filteredCheckpoints.length} checkpoints
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-xl border border-blue-200">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-2xl font-bold text-blue-700">Add New Checkpoint</DialogTitle>
                        <DialogDescription className="text-blue-600">
                            Enter the details for the new checkpoint or use your current location.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 my-4 bg-blue-100 rounded-md">
                        <p className="text-blue-800 text-sm">
                            Tip: Use the &quot;Get Current Location&quot; button to automatically fill in your coordinates.
                        </p>
                    </div>
                    <AddCheckpointForm
                        onSubmit={handleAddCheckpoint}
                        onCancel={() => setIsAddDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog
                open={deleteConfirmation.isOpen}
                onOpenChange={(isOpen) => !isOpen && setDeleteConfirmation({ isOpen: false, checkpointId: null })}
            >
                <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-red-50 to-white rounded-lg shadow-xl border border-red-200">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-2xl font-bold text-red-700">Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-red-600 font-medium">
                            Are you sure you want to delete this checkpoint? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 my-4 bg-red-100 rounded-md">
                        <p className="text-red-800 text-sm">
                            Warning: Deleting this checkpoint will permanently remove all associated data.
                        </p>
                    </div>
                    <DialogFooter className="space-x-4">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteConfirmation({ isOpen: false, checkpointId: null })}
                            className="border-red-300 text-red-700 hover:bg-red-50 transition-colors duration-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            onClick={confirmDeleteCheckpoint}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold transition-colors duration-200"
                        >
                            Delete Checkpoint
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

