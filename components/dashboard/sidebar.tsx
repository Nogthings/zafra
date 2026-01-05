"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button" // Using standard shadcn button
// import { ScrollArea } from "@/components/ui/scroll-area" // Not available yet, using div
import TenantSwitcher from "./tenant-switcher"
import { UserNav } from "./user-nav"
import { LayoutDashboard, Users, Settings } from "lucide-react"

import { User } from "@supabase/supabase-js"

export interface Tenant {
  id: string
  name: string
  slug: string
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  tenants: Tenant[]
  user: User
}

export function Sidebar({ className, tenants, user }: SidebarProps) {
  const pathname = usePathname()
  
  const routes = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Teams",
      icon: Users,
      href: "/dashboard/teams",
      active: pathname === "/dashboard/teams",
    },
  ]

  return (
    <div className={cn("space-y-4 py-4 flex flex-col h-full bg-secondary/10 dark:bg-secondary/20", className)}>
      <div className="px-3 py-2">
        <div className="flex h-14 items-center border-b px-4 mb-4">
             {/* App Logo or Name could go here if TenantSwitcher wasn't enough */}
             <span className="font-bold text-xl">Zafra</span>
        </div>
        <div className="px-3 mb-4">
          <TenantSwitcher tenants={tenants} />
        </div>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                route.active ? "text-primary bg-primary/10" : "text-muted-foreground",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.active ? "text-primary" : "text-muted-foreground")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 py-4 border-t">
          <div className="flex items-center gap-x-4 px-2">
            <UserNav user={user} />
             <div className="flex flex-col">
                 <span className="text-sm font-medium">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                 <span className="text-xs text-muted-foreground truncate w-[140px]">{user.email}</span>
             </div>
          </div>
      </div>
    </div>
  )
}
