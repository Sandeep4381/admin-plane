"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car, LayoutDashboard, Store, Users2, TicketPercent, FileX2, Wallet, Bell, GalleryHorizontal, ShieldCheck, User } from "lucide-react"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/shops", label: "Shops", icon: Store },
  { href: "/users", label: "Users", icon: Users2 },
  { href: "/rentals", label: "Rentals", icon: Car },
  { href: "/offers", label: "Offers", icon: TicketPercent },
  { href: "/earnings", label: "Earnings", icon: Wallet },
  { href: "/cancellations", label: "Cancellations", icon: FileX2 },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/banners", label: "Banners", icon: GalleryHorizontal },
  { href: "/admin-controls", label: "Admin Controls", icon: ShieldCheck },
  { href: "/profile", label: "Profile", icon: User },
];

export function Nav() {
  const pathname = usePathname()

  return (
    <SidebarMenu className="p-2">
      {navItems.map(({ href, label, icon: Icon }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton asChild isActive={pathname === href} tooltip={label}>
            <Link href={href}>
              <Icon />
              <span>{label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
