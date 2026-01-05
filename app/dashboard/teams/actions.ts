"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { randomBytes } from "crypto"
import { resend } from "@/lib/resend"

export async function inviteUser(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Unauthorized" }
    }

    const email = formData.get("email") as string
    const role = formData.get("role") as string
    const tenantId = formData.get("tenant_id") as string

    if (!email || !role || !tenantId) {
        return { error: "Missing fields" }
    }

    // Check permissions (Owner only) & Membership
    const { data: membership } = await supabase
        .from("tenant_profiles")
        .select("role")
        .eq("tenant_id", tenantId)
        .eq("profile_id", user.id)
        .single()
    
    if (!membership || membership.role !== "owner") {
         return { error: "You do not have permission to invite members." }
    }

    // Check if user is already a member
    // First we need to find the user id by email, but we might not allow searching users table publicly.
    // However, we can check if a member with this email already exists IF we join profiles.
    // For now, let's just create the invitation.
    
    // Check for existing invitation
    const { data: existingInvite } = await supabase
        .from("tenant_invitations")
        .select("id")
        .eq("tenant_id", tenantId)
        .eq("email", email)
        .single()

    if (existingInvite) {
        return { error: "Invitation already sent to this email." }
    }
    
    // Generate token
    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    const { error } = await supabase
        .from("tenant_invitations")
        .insert({
            tenant_id: tenantId,
            email,
            role,
            token,
            expires_at: expiresAt.toISOString()
        })

    if (error) {
        return { error: error.message }
    }

    // Send invitation email
    try {
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${token}`
        const { data: tenant } = await supabase.from('tenants').select('name').eq('id', tenantId).single()
        
        await resend.emails.send({
            from: 'Zafra Updates <zafra@oscargalvez.dev>', // Use verified domain in production
            to: email,
            subject: `You have been invited to join ${tenant?.name || 'a team'} on Zafra`,
            html: `
                <div>
                    <h1>Join the team!</h1>
                    <p>You have been invited to join <strong>${tenant?.name}</strong> on Zafra.</p>
                    <p>Click the link below to accept the invitation:</p>
                    <a href="${inviteLink}">Accept Invitation</a>
                    <p>Or copy this URL: ${inviteLink}</p>
                    <p>This link expires in 7 days.</p>
                </div>
            `
        })
    } catch (emailError) {
        console.error("Failed to send email:", emailError)
    }

    revalidatePath("/dashboard/teams")
    return { success: true }
}

export async function removeMember(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Unauthorized" }
    }

    const tenantId = formData.get("tenant_id") as string
    const profileId = formData.get("profile_id") as string

    // Check permissions
    const { data: membership } = await supabase
        .from("tenant_profiles")
        .select("role")
        .eq("tenant_id", tenantId)
        .eq("profile_id", user.id)
        .single()

    if (!membership || membership.role !== "owner") {
        return { error: "You do not have permission to remove members." }
    }

    if (profileId === user.id) {
         return { error: "You cannot remove yourself." }
    }

    const { error } = await supabase
        .from("tenant_profiles")
        .delete()
        .eq("tenant_id", tenantId)
        .eq("profile_id", profileId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/dashboard/teams")
    return { success: true }
}

export async function cancelInvitation(formData: FormData) {
     const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Unauthorized" }
    }

    const inviteId = formData.get("invite_id") as string
    // We assume the RLS will handle the permission check (owner check on tenant_invitations is set)
    // But we should verify. Since we can't easily join in the delete RLS check without the tenant_id in request,
    // we rely on the policy "Owners can delete invitations" defined in migration which does the check.

    const { error } = await supabase
        .from("tenant_invitations")
        .delete()
        .eq("id", inviteId)

    if (error) {
         return { error: "Failed to cancel invitation or unauthorized." }
    }

    revalidatePath("/dashboard/teams")
    return { success: true }
}

export async function updateMemberRole(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Unauthorized" }
    }

    const tenantId = formData.get("tenant_id") as string
    const profileId = formData.get("profile_id") as string
    const newRole = formData.get("role") as string

    // Check permissions
    const { data: membership } = await supabase
        .from("tenant_profiles")
        .select("role")
        .eq("tenant_id", tenantId)
        .eq("profile_id", user.id)
        .single()

    if (!membership || membership.role !== "owner") {
        return { error: "You do not have permission to update roles." }
    }
    
     if (profileId === user.id) {
         return { error: "You cannot change your own role." }
    }

    const { error } = await supabase
        .from("tenant_profiles")
        .update({ role: newRole })
        .eq("tenant_id", tenantId)
        .eq("profile_id", profileId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/dashboard/teams")
    return { success: true }
}
