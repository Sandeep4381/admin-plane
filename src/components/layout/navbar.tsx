import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserNav } from './user-nav';

export function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6 sticky top-0 z-30">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1"></div>
        <UserNav />
    </header>
  )
}
