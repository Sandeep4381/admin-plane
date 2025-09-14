import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserNav } from './user-nav';
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6 sticky top-0 z-30">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1"></div>
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Super Admin</span>
            <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5"/>
                <Badge className="absolute top-0 right-0 h-4 w-4 justify-center p-0 text-xs" variant="destructive">3</Badge>
                <span className="sr-only">Notifications</span>
            </Button>
            <UserNav />
        </div>
    </header>
  )
}
