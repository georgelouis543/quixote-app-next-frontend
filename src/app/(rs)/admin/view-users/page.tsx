'use client'

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import UserRow from "@/components/users/UserRow"
import { useGetUsersQuery } from "@/features/users/usersApiSlice"
import { Loader, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ViewUsersPage() {
    const router = useRouter()

    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery(undefined, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) {
        content = (
            <div className="flex flex-col items-center space-y-2">
                <Loader className="h-10 w-10 animate-spin text-gray-600" />
                <p className="text-gray-500 text-sm">Loading users...</p>
            </div>
        )
    } else if (isError) {
        content = <p className="text-red-600">{JSON.stringify(error)}</p>
    } else if (isSuccess && users) {
        content = (
            <Table className="shadow-md">
                <TableCaption className="font-bold">
                    List of all users
                </TableCaption>
                <TableHeader className="font-bold text-l shadow-xl">
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Edit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.ids.map((userId) => (
                        <UserRow 
                            key={userId} 
                            userId={userId as number} 
                        />
                        )
                    )}
                </TableBody>
            </Table>
        )
    }

    return (
        <div className="p-4 mt-10 flex flex-col">
            <Button 
                onClick={() => router.push('/admin/add-user')}
                className="w-[150px] rounded-none mb-5 bg-white border border-gray-300 text-black shadow-md hover:bg-gray-100">
                <UserPlus />
                Add New User
            </Button>
            <div>
                {content}
            </div>
        </div>
    )
}