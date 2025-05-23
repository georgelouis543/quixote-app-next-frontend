'use client'

import usePersist from "@/hooks/usePersist"
import { useSelector } from "react-redux"
import { selectCurrentToken } from "./authSlice"
import { useEffect, useRef, useState } from "react"
import { useRefreshMutation } from "./authApiSlice"
import Link from "next/link"

export default function PersistLogin({ children }: { children: React.ReactNode } ) {
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error,
      }] = useRefreshMutation()

      useEffect(() => {
        console.log('Token:', token)
        console.log('Persist:', persist)
      }, [token, persist])

    useEffect(() => {
        if (effectRan.current) {
            const verifyRefreshToken = async () => {
            try {
                await refresh().unwrap()
                setTrueSuccess(true)
            } catch (err) {
                console.error("Refresh failed", err)
            }
            }

            if (!token && persist) verifyRefreshToken()
        }

        return () => {
            effectRan.current = true
        }
    }, [token, persist, refresh])

    if (!persist) {
        console.log('no persist')
        return (
            // <>
            //     {children} // Use this when Remember me flag is added in future
            // </>
            <p className="flex flex-col items-center justify-center w-full h-screen text-center px-2">
                Checking Session...
            </p>
        )
    } else if (isLoading) {
        console.log('loading')
        return (
            <p className="flex flex-col items-center justify-center w-full h-screen text-center px-2">
                Loading...
            </p>
        )
    } else if (isError) {
        console.log('error')
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen text-center px-2">
                
                <h2 className="text-3xl font-bold mb-4 text-red-600">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(error as any)?.data?.detail || "Session expired"}
                </h2>
                
                <Link
                    href="/login"
                    className="underline text-blue-800"
                >
                    Please login again
                </Link>
          </div>
        )
    } else if ((isSuccess && trueSuccess) || (token && isUninitialized)) {
        return (
            <>
                {children}
            </>
        )
    }

    return null
    
  
}