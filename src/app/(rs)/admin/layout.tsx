'use client'

import { ROLES } from "@/config/roles"
import RequireAuth from "@/features/auth/RequireAuth"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
  return (
    <RequireAuth allowedRoles={[ROLES.admin]}>
      {children}
    </RequireAuth>
  )
}
