"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTA() {
    return (
        <section className="container py-24 sm:py-32">
            <div className="flex flex-col items-center gap-4 text-center">
                <h2 className="text-3xl font-bold sm:text-5xl">
                    Ready to launch your next idea?
                </h2>
                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    Save weeks of setup time and focus on building your product.
                </p>
                <div className="flex gap-4 mt-6">
                    <Button size="lg" asChild>
                        <Link href="#start">Get Started Now</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
