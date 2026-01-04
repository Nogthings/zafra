"use client"

import { Database, Layout, CreditCard, Lock, Zap, Github } from "lucide-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const features = [
    {
        name: "Next.js 16",
        description: "Built on the latest version of Next.js with App Router and Server Actions.",
        icon: Layout,
    },
    {
        name: "Supabase",
        description: "Complete backend solution with Database, Auth, and Realtime subscriptions.",
        icon: Database,
    },
    {
        name: "Stripe",
        description: "Seamless payments integration for subscriptions and one-time purchases.",
        icon: CreditCard,
    },
    {
        name: "Authentication",
        description: "Secure authentication flow pre-configured with Supabase Auth.",
        icon: Lock,
    },
    {
        name: "Tailwind CSS",
        description: "Styled with Tailwind CSS and Shadcn UI for a modern look.",
        icon: Zap,
    },
    {
        name: "Open Source",
        description: "MIT Licensed. Free for personal and commercial use.",
        icon: Github,
    },
]

export function Features() {
    return (
        <section id="features" className="container py-24 sm:py-32 space-y-8">
            <div className="mx-auto max-w-[58rem] text-center">
                <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
                    Features
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 mx-auto mt-4">
                    Everything you need to build your SaaS is included. No hidden costs.
                </p>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                {features.map((feature) => (
                    <Card key={feature.name} className="transition-all hover:scale-105 border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <feature.icon className="h-10 w-10 text-primary mb-2" />
                            <CardTitle>{feature.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
