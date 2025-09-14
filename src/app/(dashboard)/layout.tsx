import type { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
        <Sidebar>
            {children}
        </Sidebar>
    </SidebarProvider>
  );
}
