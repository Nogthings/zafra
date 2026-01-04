"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export function Donations() {
    return (
        <section id="donations" className="container py-24 sm:py-32">
            <div className="rounded-3xl bg-muted px-6 py-16 sm:px-12 sm:py-24 lg:px-16 text-center">
                <div className="mx-auto max-w-2xl space-y-4">
                    <div className="flex justify-center">
                        <div className="p-3 bg-background rounded-full">
                            <Heart className="h-10 w-10 text-red-500 fill-current" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Support Open Source
                    </h2>
                    <p className="mx-auto max-w-xl text-muted-foreground text-lg">
                        Zafra is and will always be free. If you find it useful, consider supporting the maintenance and detailed documentation dev.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Button size="lg" className="w-full sm:w-auto">
                            Donate via Stripe
                        </Button>
                        <Button size="lg" variant="outline" className="w-full sm:w-auto">
                            Sponsor on GitHub
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
