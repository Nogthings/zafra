"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Unauthorized")
    }

    const fullName = formData.get("full_name") as string
    const email = formData.get("email") as string

    // Update profile table
    const { error: profileError } = await supabase
        .from("profiles")
        .update({
            full_name: fullName,
            email: email,
            updated_at: new Date().toISOString()
        })
        .eq("id", user.id)

    if (profileError) {
        return { error: profileError.message }
    }

    // Update auth email if changed
    if (email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({
            email: email
        })

        if (authError) {
            return { error: authError.message }
        }
    }

    revalidatePath("/dashboard/profile")
    return { success: true }
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Unauthorized")
    }

    const newPassword = formData.get("new_password") as string
    const confirmPassword = formData.get("confirm_password") as string

    if (newPassword !== confirmPassword) {
        return { error: "Passwords do not match" }
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function uploadAvatar(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Unauthorized")
    }

    const file = formData.get("avatar") as File
    if (!file || file.size === 0) {
        return { error: "No file provided" }
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true })

    if (uploadError) {
        return { error: uploadError.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath)

    // Update profile
    const { error: updateError } = await supabase
        .from("profiles")
        .update({
            avatar_url: publicUrl,
            updated_at: new Date().toISOString()
        })
        .eq("id", user.id)

    if (updateError) {
        return { error: updateError.message }
    }

    // Update user metadata so it reflects in UserNav immediately
    const { error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
    })

    if (authError) {
        console.error("Error updating user metadata:", authError)
        // We continue even if this fails, as the profile was updated
    }

    revalidatePath("/dashboard/profile")
    return { success: true, url: publicUrl }
}
