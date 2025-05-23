import useAuth from '@/hooks/useAuth'
import Link from 'next/link'
import { ReactNode } from 'react'

type RequireAuthProps = {
    allowedRoles: string[]
    children: ReactNode
}

const RequireAuth = ({ 
    allowedRoles, 
    children 
}: RequireAuthProps) => {
    const { status } = useAuth()

    return allowedRoles.includes(status) ? (
        <>
         {children}
        </>
    ) : (
        <div className="flex flex-col items-center justify-center w-full h-screen text-center px-2">
            <h2 className="text-3xl font-bold mb-4 text-black">
                Uh-oh! 🚫 You&apos;re not supposed to be here
            </h2>
            <Link
                href="/login"
                className="underline text-red-600"
            >
                Try logging in with the right account.
            </Link>
        </div>
    )
}

export default RequireAuth
