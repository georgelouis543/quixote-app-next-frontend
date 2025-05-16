'use client'

import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSendLogoutMutation } from "@/features/auth/authApiSlice";

type Props = {
    icon: LucideIcon,
    label: string
}

export default function LogoutButton({
    icon: Icon,
    label      
}: Props) {
    const router = useRouter()

    const [sendLogout, { 
        isLoading 
    }] = useSendLogoutMutation()

    const handleLogout = async () => {
        try {
          await sendLogout().unwrap()
          router.push('/login')
        } catch (err) {
          console.error('Logout failed:', err)
        }
      }

    return (
        <Button
            onClick={handleLogout}
            variant="ghost"
            size="icon"
            aria-label={label}
            title={label}
            className="rounded-full"
            disabled={isLoading}
        >
            <Icon />
        </Button>
    )
}