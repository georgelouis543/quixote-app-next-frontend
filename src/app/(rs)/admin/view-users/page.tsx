'use client'

import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import UserRow from "@/components/users/UserRow"
import { useGetUsersQuery } from "@/features/users/usersApiSlice"

export default function ViewUsersPage() {

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
        content = <p>Loading...</p>
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
        <div className="p-4 mt-10">
            {content}
        </div>
    )
}