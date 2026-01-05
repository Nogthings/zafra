"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

export function Navbar() {
    const [activeSection, setActiveSection] = React.useState<string>("")

    React.useEffect(() => {
        const observers: IntersectionObserver[] = []
        const sections = ["features", "donations"]

        sections.forEach((sectionId) => {
            const element = document.getElementById(sectionId)
            if (element) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                setActiveSection(sectionId)
                            }
                        })
                    },
                    { threshold: 0.5 }
                )
                observer.observe(element)
                observers.push(observer)
            }
        })

        return () => {
            observers.forEach((observer) => observer.disconnect())
        }
    }, [])

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2 font-bold text-xl">
                        Zafra
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="#features"
                            className={cn(
                                "transition-colors hover:text-foreground/80",
                                activeSection === "features" ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            Features
                        </Link>
                        <Link
                            href="#donations"
                            className={cn(
                                "transition-colors hover:text-foreground/80",
                                activeSection === "donations" ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            Support
                        </Link>
                        <Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Documentation
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="hidden md:flex items-center space-x-2">
                        <ModeToggle />
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="https://github.com/Nogthings/zafra" target="_blank" rel="noreferrer">
                                <Icons.gitHub className="h-4 w-4" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href="/login">Get Started</Link>
                        </Button>
                    </div>

                    <div className="md:hidden flex items-center gap-2">
                        <ModeToggle />
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <div className="flex flex-col space-y-4 mt-8">
                                    <Link href="#features" className="text-lg font-medium">
                                        Features
                                    </Link>
                                    <Link href="#donations" className="text-lg font-medium">
                                        Support
                                    </Link>
                                    <Link href="#" className="text-lg font-medium">
                                        Documentation
                                    </Link>
                                    <Link href="/login">
                                        <Button className="w-full">Get Started</Button>
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}
