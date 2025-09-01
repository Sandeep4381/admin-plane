import type { ReactNode } from 'react';
import { Car } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarTrigger, SidebarFooter } from '@/components/ui/sidebar';
import { Nav } from './nav';
import { UserNav } from './user-nav';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
             <a href="/" className="flex items-center gap-2 font-semibold">
              <Car className="size-7 text-primary" />
              <span className="text-xl font-bold text-sidebar-foreground">SawariKaro</span>
            </a>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <Nav />
        </SidebarContent>
        <SidebarFooter>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1"></div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
