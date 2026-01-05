"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function acceptInvitation(prevState: { error: string } | null, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const token = formData.get("token") as string

    const { data: result, error } = await supabase.rpc('accept_invitation', { lookup_token: token })

    if (error) {
        return { error: error.message }
    }

    if (result && result.error) {
        return { error: result.error }
    }

    redirect("/dashboard")
}

// Forced refresh

