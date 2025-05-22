'use client'

import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

type Props = {
    icon: LucideIcon,
    label: string,
    href?: string,
}

export function AdminButton({
    icon: Icon,
    label,
    href,
}: Props) {
    const { isAdmin } = useAuth()

    if (!isAdmin) return null

    
    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label={label}
            title={label}
            className="rounded-full"
            asChild
        >
            {href ? (
                <Link href={href}>
                    <Icon />
                </Link>
            ) : (
                <Icon />
            )}
        </Button>
    )
}