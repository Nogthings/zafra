"use client"

import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"


import { User } from "@supabase/supabase-js"
import { Tenant } from "./sidebar"

interface MobileSidebarProps {
  tenants: Tenant[]
  user: User
}

export const MobileSidebar = ({ tenants, user }: MobileSidebarProps) => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar when route changes
    useEffect(() => {
        if (open) {
            setOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-background text-foreground" style={{ maxWidth: '300px' }}>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation for the dashboard.</SheetDescription>
                <Sidebar tenants={tenants} user={user} className="border-none" />
            </SheetContent>
        </Sheet>
    )
}
