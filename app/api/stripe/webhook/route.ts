import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import Stripe from "stripe"

// We need a Supabase Admin client to bypass RLS for webhooks
const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
    const body = await req.text()
    const signature = (await headers()).get("Stripe-Signature") as string

    let event: Stripe.Event

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
             throw new Error("STRIPE_WEBHOOK_SECRET is missing")
        }
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session

    try {
        if (event.type === "checkout.session.completed") {
            const tenantId = session.metadata?.tenantId

            if (tenantId) {
                // Retrieve the subscription details if it exists
                const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
                
                // If this was a one-time payment (donation), we might just mark them as supporter indefinitely or handle differently.
                // For now, let's treat any successful checkout as activating the plan.

                const { error } = await supabaseAdmin
                    .from("tenants")
                    .update({
                        stripe_subscription_id: subscriptionId || null,
                        stripe_customer_id: session.customer as string,
                        plan_active: true
                    })
                    .eq("id", tenantId)
                
                if (error) {
                    console.error('Error updating tenant:', error)
                    return new NextResponse(`Database Error: ${error.message}`, { status: 500 })
                }
            }
        }

        if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
            const subscription = event.data.object as Stripe.Subscription;
            
            // BETTER: Lookup tenant by customer ID
            const customerId = subscription.customer as string;

            // Check status
            const planActive = subscription.status === 'active';

            const { error } = await supabaseAdmin
                .from("tenants")
                .update({
                    plan_active: planActive,
                    stripe_subscription_id: subscription.id,
                    stripe_current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString()
                })
                .eq("stripe_customer_id", customerId)

             if (error) {
                console.error('Error updating tenant subscription:', error)
                return new NextResponse(`Database Error: ${error.message}`, { status: 500 })
            }
        }
    } catch (err: unknown) {
        console.error("Webhook processing error:", err)
        const message = err instanceof Error ? err.message : "Unknown error"
        return new NextResponse(`Server Error: ${message}`, { status: 500 })
    }

    return new NextResponse(null, { status: 200 })
}
