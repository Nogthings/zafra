"use server"

import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"

export async function createPortalSession() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Unauthorized")
    }

    // Get tenant
    const { data: membership } = await supabase
        .from("tenant_profiles")
        .select("tenant_id")
        .eq("profile_id", user.id)
        .single()

    if (!membership) {
        throw new Error("No membership found")
    }

    const { data: tenant } = await supabase
        .from("tenants")
        .select("stripe_customer_id")
        .eq("id", membership.tenant_id)
        .single()

    if (!tenant?.stripe_customer_id) {
        throw new Error("No customer ID found")
    }

    const returnUrl = process.env.NEXT_PUBLIC_SITE_URL 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
        : "http://localhost:3000/dashboard"

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: tenant.stripe_customer_id,
        return_url: returnUrl,
    })

    redirect(portalSession.url)
}
