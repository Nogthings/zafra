import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/dashboard/profile-form"

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch profile data
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>
            <ProfileForm user={user} profile={profile} />
        </div>
    )
}
