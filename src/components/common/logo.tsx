import { Car } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
    return (
        <Link href="/dashboard" className="flex items-center gap-2 p-2 font-semibold">
            <Car className="size-7 text-primary" />
            <span className="text-xl font-bold text-sidebar-foreground">SawariKaro</span>
        </Link>
    );
}
