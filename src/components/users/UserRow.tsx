'use client'

import { useGetUsersQuery } from "@/features/users/usersApiSlice"
import { useRouter } from "next/navigation"
import { TableCell, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { Pencil } from "lucide-react"
import { memo } from "react"

interface UserProps {
    userId: number
  }

const UserRow = ({ 
    userId 
}: UserProps) => {
    const { user } = useGetUsersQuery(undefined, {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        })
    })
  
    const router = useRouter()

    const handleEdit = () => {
        router.push(`/admin/edit-user/${userId}`)
    }

    if (!user) return null

    return (
        <TableRow>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.user_email}</TableCell>
            <TableCell>{user.user_name}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleEdit}
                >
                    <Pencil />
                </Button>
            </TableCell>
        </TableRow>
  )
}

export default memo(UserRow)
