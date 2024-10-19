'use client'

import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { UserCircle, Mail, Calendar, Crown, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import LoadingScreen from '../TruckLoader'

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

const queryClient = new QueryClient()

async function fetchUsers(): Promise<User[]> {
    const response = await fetch('/api/users')
    if (!response.ok) {
        throw new Error('Failed to fetch users')
    }
    return response.json()
}

function UserDashboardContent({ isSuperAdmin }: Props) {
    const { data: users = [], isLoading, error } = useQuery('users', fetchUsers, {
        staleTime: 60000, // Cache data for 1 minute
    })

    const handleStatusChange = async (userId: string, newStatus: User['status']) => {
        // Implement the API call to update user status
        console.log(`Updating user ${userId} status to ${newStatus}`)
    }

    const handleDeleteUser = async (userId: string) => {
        // Implement the API call to delete user
        console.log(`Deleting user ${userId}`)
    }

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <LoadingScreen status="preparing" />
        </div>
    )

    if (error) return (
        <div className="text-center text-red-500">
            Error fetching users. Please try again later.
        </div>
    )

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">User Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Subscription</TableHead>
                                <TableHead>Registered</TableHead>
                                <TableHead>Status</TableHead>
                                {isSuperAdmin && <TableHead className="text-right">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-2">
                                            <UserCircle className="h-6 w-6 text-primary" />
                                            <span>{user.username}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span>{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{user.subscription}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{user.registerDate}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {isSuperAdmin ? (
                                            <Select
                                                onValueChange={(value) => handleStatusChange(user.id, value as User['status'])}
                                                defaultValue={user.status}
                                            >
                                                <SelectTrigger className="w-[140px]">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Free">Free</SelectItem>
                                                    <SelectItem value="Friend">Friend</SelectItem>
                                                    <SelectItem value="Admin">Admin</SelectItem>
                                                    <SelectItem value="SuperAdmin">Super Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <Crown className="h-4 w-4 text-yellow-500" />
                                                <span>{user.status}</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    {isSuperAdmin && (
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-100"
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
            </CardContent>
        </Card>
    )
}

export default function UserDashboard(props: Props) {
    return (
        <QueryClientProvider client={queryClient}>
            <UserDashboardContent {...props} />
        </QueryClientProvider>
    )
}