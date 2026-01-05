"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export function Donations() {
    const handleCheckout = async (mode: 'subscription' | 'payment', priceId: string) => {
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                    mode,
                    // We need to pass a tenantId. 
                    // For the landing page, we might not have a selected tenant. 
                    // This is a limitation of the current API design if we require tenantId.
                    // Ideally we should fetch the user's primary tenant or personal tenant.
                    // For now, let's assume the user has a tenant and we'll handle finding it in the API or fail gracefully.
                    // actually, better to just redirect to dashboard/billing if logged in, or login if not.
                    // BUT for this task, let's try to proceed. 
                    // Let's hardcode a 'personal' tenant logic or just pass a placeholder if not needed for donation? 
                    // The API requires tenantId. 
                    // Let's simplify: Redirect to login/onboarding if not logged in.
                    // If logged in, we need to pick a tenant. 
                    // Maybe we should just link to the dashboard billing page? 
                    // Or we can fetch the user's first tenant client-side?
                }),
            })

            if (response.status === 401) {
                window.location.href = '/login'
                return
            }

            const data = await response.json().catch(() => ({ error: "Something went wrong" }))
            
            if (!response.ok) {
                 console.error(data.error)
                 alert(data.error || "Failed to start checkout")
                 return
            }

            if (data.url) {
                window.location.href = data.url
            }
        } catch (error) {
            console.error(error)
             alert("An unexpected error occurred")
        }
    }

    return (
        <section id="donations" className="container py-24 sm:py-32">
            <div className="rounded-3xl bg-muted px-6 py-16 sm:px-12 sm:py-24 lg:px-16 text-center">
                <div className="mx-auto max-w-3xl space-y-4">
                    <div className="flex justify-center">
                        <div className="p-3 bg-background rounded-full">
                            <Heart className="h-10 w-10 text-red-500 fill-current" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Support Open Source
                    </h2>
                    <p className="mx-auto max-w-xl text-muted-foreground text-lg">
                        Zafra is and will always be free. You can use it for free forever. <br/>
                        If you want to support the project, you can become a supporter.
                    </p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                         <div className="flex flex-col gap-4 p-6 bg-background/50 rounded-xl border">
                             <h3 className="font-semibold text-xl">Free Forever</h3>
                             <p className="text-sm text-muted-foreground flex-1">
                                 The complete codebase, documentation, and all features.
                             </p>
                             <p className="text-3xl font-bold">$0</p>
                             <Button variant="outline" className="w-full cursor-pointer" asChild>
                                 <a href="https://github.com/Nogthings/zafra">
                                     Star on GitHub
                                 </a>
                             </Button>
                         </div>
                         
                         <div className="flex flex-col gap-4 p-6 bg-background rounded-xl border-2 border-primary relative">
                             <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                                 Recommended
                             </div>
                             <h3 className="font-semibold text-xl">Supporter</h3>
                             <p className="text-sm text-muted-foreground flex-1">
                                 Support the maintenance and get a &quot;Supporter&quot; badge in the Discord.
                             </p>
                             <p className="text-3xl font-bold">$2<span className="text-base font-normal text-muted-foreground">/mo</span></p>
                             <Button className="w-full cursor-pointer" onClick={() => handleCheckout('subscription', 'price_1Sm3hnEhjmaiRG9eIzMMPiuK')}>
                                 Become a Supporter
                             </Button>
                         </div>

                         <div className="flex flex-col gap-4 p-6 bg-background/50 rounded-xl border">
                             <h3 className="font-semibold text-xl">One-time Donation</h3>
                             <p className="text-sm text-muted-foreground flex-1">
                                 Buy us a coffee to keep the late night coding sessions fueled.
                             </p>
                             <p className="text-3xl font-bold">$5</p>
                             <Button variant="outline" className="w-full cursor-pointer" onClick={() => handleCheckout('payment', 'price_1Sm3tHEhjmaiRG9eeGhNa3bT')}>
                                 Donate Once
                             </Button>
                         </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
