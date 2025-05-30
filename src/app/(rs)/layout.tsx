'use client'

import { Header } from "@/components/header/Header"
import { ROLES } from "@/config/roles"
import PersistLogin from "@/features/auth/PersistLogin"
import RequireAuth from "@/features/auth/RequireAuth"
import useMounted from "@/hooks/useMounted"

export default function RSLayout({
    children,
}: {
    children: React.ReactNode
}) {
  const mounted = useMounted()

  if (!mounted) return null // to fix hydration mismatch

  return (
    <PersistLogin>
      <RequireAuth allowedRoles={[ROLES.admin, ROLES.user]}>
        <div className="mx-auto w-full max-w-7xl">
            <Header />
            <div className="px-4 py-2">
                {children}
            </div>
        </div>
      </RequireAuth>
    </PersistLogin>
  )
}
