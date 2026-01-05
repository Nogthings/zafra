import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const body = await req.json()
        const { priceId, mode, successUrl, cancelUrl } = body
        let { tenantId } = body

        if (!priceId || !mode) {
             return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // If tenantId is missing, find the first tenant the user belongs to
        if (!tenantId) {
             const { data: firstMembership } = await supabase
                .from("tenant_profiles")
                .select("tenant_id")
                .eq("profile_id", user.id)
                .limit(1)
                .single()
            
            if (firstMembership) {
                tenantId = firstMembership.tenant_id
            }
        }

        if (!tenantId) {
             return NextResponse.json({ error: "No tenant found for user. Please create an organization first." }, { status: 400 })
        }

        // Verify user is a member of the tenant
        const { data: membership } = await supabase
            .from("tenant_profiles")
            .select("role")
            .eq("tenant_id", tenantId)
            .eq("profile_id", user.id)
            .single()

        if (!membership) {
            return new NextResponse("Unauthorized tenant access", { status: 403 })
        }
        
        // Fetch tenant to get stripe_customer_id if it exists
        const { data: tenant } = await supabase
            .from("tenants")
            .select("stripe_customer_id")
            .eq("id", tenantId)
            .single()

        let customerId = tenant?.stripe_customer_id

        // If no customer ID, create one
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    tenantId: tenantId,
                },
            })
            customerId = customer.id
            
            // Save customer ID to tenant
            await supabase
                .from("tenants")
                .update({ stripe_customer_id: customerId })
                .eq("id", tenantId)
        }

        const appUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: mode, // 'subscription' or 'payment'
            success_url: successUrl || `${appUrl}/dashboard?success=true`,
            cancel_url: cancelUrl || `${appUrl}/dashboard?canceled=true`,
            metadata: {
                tenantId: tenantId,
                userId: user.id,
            },
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error("[STRIPE_CHECKOUT]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
