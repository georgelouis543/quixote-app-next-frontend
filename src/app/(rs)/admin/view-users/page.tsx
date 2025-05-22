'use client'

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
            <ul className="space-y-2">
                {users.ids.map(id => {
                    const user = users.entities[id]
                    return (
                        <li key={id} className="border p-2 rounded shadow">
                            <p><strong>ID:</strong> {user?.id}</p>
                            <p><strong>Username:</strong> {user?.user_name}</p>
                            <p><strong>Email:</strong> {user?.user_email}</p>
                            <p><strong>Role:</strong> {user?.role}</p>
                        </li>
                    )
                })}
            </ul>
        )
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">All Users</h1>
            {/* {content} */}
            Add Table tomorrow!
        </div>
    )
}