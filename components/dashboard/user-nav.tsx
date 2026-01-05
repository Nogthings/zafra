"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { signOut } from "@/app/login/actions"
  import { User } from "@supabase/supabase-js"
  import Link from "next/link"
  
  interface UserNavProps {
    user: User
  }
  
  export function UserNav({ user }: UserNavProps) {
    // Get initials for avatar fallback
    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/dashboard/profile">
              <DropdownMenuItem>
                Profile
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => {
              // Using onSelect instead of onClick to prevent default closing behavior if needed
              // But form submission will reload page anyway
          }}>
             <form action={signOut} className="w-full">
                <button type="submit" className="w-full text-left">Log out</button>
             </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
