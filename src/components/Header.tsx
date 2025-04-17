import { HomeIcon, Newspaper, Sheet } from 'lucide-react';
import Link from 'next/link';

import { NavButton } from '@/components/NavButton';

export function Header() {
    return (
        <header className="h-15 p-3 border-b border-black sticky top-0 z-20">

            <div className="flex h-8 items-center justify-between w-full">

                <div className="flex items-center gap-2">
                    <Link href="/home" className="flex justify-center items-center gap-2 ml-0" title="Home">
                        <h1 className="hidden sm:block text-xl font-bold m-0 mt-[1px]">
                            Quixote App
                        </h1>
                    </Link>
                </div>

                <div className="flex items-center">

                    <NavButton 
                        href="/home" 
                        label="Home" 
                        icon={HomeIcon} 
                    />

                    <NavButton 
                        href="/newsletter-analytics/platform-analytics" 
                        label="Export NL Platform Analytics" 
                        icon={Newspaper} 
                    />

                    <NavButton 
                        href="/newsletter-analytics/sendgrid-analytics" 
                        label="Export Sendgrid Analytics" 
                        icon={Sheet} 
                    />

                </div>

            </div>

        </header>
    )
}