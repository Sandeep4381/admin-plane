import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar as RootSidebar, SidebarHeader, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import { Navbar } from './navbar';
import { Nav } from './nav';
import { Logo } from '../common/logo';

export function Sidebar({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <RootSidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <Nav />
        </SidebarContent>
      </RootSidebar>
      <SidebarInset>
        <Navbar />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
