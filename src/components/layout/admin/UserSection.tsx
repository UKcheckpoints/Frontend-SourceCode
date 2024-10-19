"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { UserCircle, Mail, Calendar, Crown, Trash2, ChevronLeft, ChevronRight, Search, Bell, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog"
import { Checkbox } from "@/components/ui/Checkbox"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"

type User = {
    id: string
    username: string
    email: string
    subscription: string
    registerDate: string
    status: 'Free' | 'Friend' | 'Admin' | 'SuperAdmin'
}

type Props = {
    isSuperAdmin: boolean
}

// Mock data (20 users as provided in the original code)
const mockUsers: User[] = [
    {
        id: '1',
        username: 'alice',
        email: 'user1@example.com',
        subscription: 'Friend',
        registerDate: '2015-02-03',
        status: 'Admin'
    },
    {
        id: '2',
        username: 'bob',
        email: 'user2@example.com',
        subscription: 'Free',
        registerDate: '2023-10-08',
        status: 'Admin'
    },
    {
        id: '3',
        username: 'charlie',
        email: 'user3@example.com',
        subscription: 'Friend',
        registerDate: '2022-08-21',
        status: 'Friend'
    }
];

function UserDashboardContent({ isSuperAdmin }: Props) {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [usersPerPage, setUsersPerPage] = useState(10)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [notificationMessage, setNotificationMessage] = useState('')
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; userId: string | null }>({
        isOpen: false,
        userId: null
    });


    const filteredUsers = useMemo(() => {
        return mockUsers.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [searchTerm])

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, usersPerPage])

    const currentUsers = useMemo(() => {
        const indexOfLastUser = currentPage * usersPerPage
        const indexOfFirstUser = indexOfLastUser - usersPerPage
        return filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
    }, [currentPage, usersPerPage, filteredUsers])

    const handleStatusChange = async (userId: string, newStatus: User['status']) => {
        console.log(`Updating user ${userId} status to ${newStatus}`)
    }

    const handleDeleteUser = (userId: string) => {
        setDeleteConfirmation({ isOpen: true, userId });
    };

    const handleUserSelection = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        )
    }

    const removeUser = (userId: string) => {
        setSelectedUsers(prev => prev.filter(id => id !== userId));
    };

    const handleNotifyUsers = () => {
        console.log(`Notifying users: ${selectedUsers.join(', ')}`)
        console.log(`Message: ${notificationMessage}`)
        // Reset selection and message after notifying
        setSelectedUsers([])
        setNotificationMessage('')
    }

    const confirmDeleteUser = () => {
        if (deleteConfirmation.userId) {
            console.log(`Deleting user ${deleteConfirmation.userId} from the database`);
            // Here you would typically call an API to delete the user
        }
        setDeleteConfirmation({ isOpen: false, userId: null });
    };


    return (
        <Card className="w-full bg-sky-50 shadow-lg">
            <CardHeader className="bg-sky-100 border-b border-sky-200">
                <CardTitle className="text-3xl font-bold text-sky-800">User Management</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-500" />
                        <Input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 w-full border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select
                        value={usersPerPage.toString()}
                        onValueChange={(value) => setUsersPerPage(Number(value))}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Users per page" />
                        </SelectTrigger>
                        <SelectContent className='bg-sky-100'>
                            <SelectItem value="5">5 per page</SelectItem>
                            <SelectItem value="10">10 per page</SelectItem>
                            <SelectItem value="20">20 per page</SelectItem>
                        </SelectContent>
                    </Select>
                    {isSuperAdmin && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="ml-4 transition-all duration-300 hover:bg-sky-100">
                                    <Bell className="mr-2 h-4 w-4 animate-pulse" />
                                    Notify Users
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-sky-100 to-white rounded-lg shadow-lg">
                                <DialogHeader className="space-y-2">
                                    <DialogTitle className="text-2xl font-bold text-sky-700">Notify Users</DialogTitle>
                                    <DialogDescription className="text-sky-600">
                                        Send a notification to selected users. Choose the recipients and compose your message.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="recipients" className="text-sky-700 font-semibold">
                                            Recipients:
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedUsers.map(userId => {
                                                const user = mockUsers.find(u => u.id === userId)
                                                return user ? (
                                                    <Badge
                                                        key={userId}
                                                        variant="secondary"
                                                        className="bg-sky-200 text-sky-700 px-3 py-1 rounded-full transition-all duration-300 hover:bg-sky-300"
                                                    >
                                                        {user.username}
                                                        <X className="ml-2 h-3 w-3 cursor-pointer" onClick={() => removeUser(userId)} />
                                                    </Badge>
                                                ) : null
                                            })}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="text-sky-700 font-semibold">
                                            Message:
                                        </Label>
                                        <Textarea
                                            id="message"
                                            className="bg-gray-200 w-full p-3 border border-black rounded-md focus:ring-2 focus:ring-sky-300 focus:border-transparent transition-all duration-300"
                                            value={notificationMessage}
                                            onChange={(e) => setNotificationMessage(e.target.value)}
                                            placeholder="Type your notification message here..."
                                            rows={4}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        onClick={handleNotifyUsers}
                                        className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300"
                                    >
                                        Send Notification
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-sky-100">
                                {isSuperAdmin && (
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={selectedUsers.length === currentUsers.length}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedUsers(currentUsers.map(user => user.id))
                                                } else {
                                                    setSelectedUsers([])
                                                }
                                            }}
                                        />
                                    </TableHead>
                                )}
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">User</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Email</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Subscription</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Registered</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Status</TableHead>
                                {isSuperAdmin && <TableHead className="px-6 py-3 text-right text-xs font-medium text-sky-700 uppercase tracking-wider">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white divide-y divide-sky-200">
                            {currentUsers.map((user) => (
                                <TableRow key={user.id} className="transition-colors hover:bg-sky-50">
                                    {isSuperAdmin && (
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedUsers.includes(user.id)}
                                                onCheckedChange={() => handleUserSelection(user.id)}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <UserCircle className="h-10 w-10 text-sky-500" />
                                            <div className="ml-4 text-sm font-medium text-sky-900">{user.username}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Mail className="h-4 w-4 text-sky-400 mr-2" />
                                            <div className="text-sm text-sky-700">{user.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant="secondary" className="bg-sky-100 text-sky-800 px-2 py-1 text-xs rounded-full">
                                            {user.subscription}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-sky-700">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 text-sky-400 mr-2" />
                                            <span>{user.registerDate}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        {isSuperAdmin ? (
                                            <Select
                                                onValueChange={(value) => handleStatusChange(user.id, value as User['status'])}
                                                defaultValue={user.status}
                                            >
                                                <SelectTrigger className="w-[140px] bg-white border-sky-200 text-sky-700">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent className='bg-sky-100'>
                                                    <SelectItem value="Free">Free</SelectItem>
                                                    <SelectItem value="Friend">Friend</SelectItem>
                                                    <SelectItem value="Admin">Admin</SelectItem>
                                                    <SelectItem value="SuperAdmin">Super Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="flex items-center">
                                                <Crown className="h-4 w-4 text-yellow-500 mr-2" />
                                                <span className="text-sm text-sky-700">{user.status}</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    {isSuperAdmin && (
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteUser(user.id)}
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
                    <div className="text-sm text-sky-700">
                        Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
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
            <Dialog open={deleteConfirmation.isOpen} onOpenChange={(isOpen) => !isOpen && setDeleteConfirmation({ isOpen: false, userId: null })}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-red-600">Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Are you sure you want to delete this user from the database? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteConfirmation({ isOpen: false, userId: null })}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={confirmDeleteUser}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default function UserDashboard(props: Props) {
    return <UserDashboardContent {...props} />
}