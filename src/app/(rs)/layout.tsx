'use client'

import { Header } from "@/components/Header"
import PersistLogin from "@/features/auth/PersistLogin"

export default function RSLayout({
    children,
}: {
    children: React.ReactNode
}) {
  return (
    <PersistLogin>
      <div className="mx-auto w-full max-w-7xl">
          <Header />
          <div className="px-4 py-2">
              {children}
          </div>
      </div>
    </PersistLogin>
  )
}
