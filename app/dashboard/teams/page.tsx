import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { inviteUser, removeMember, cancelInvitation } from "./actions"
import { InviteMemberDialog } from "@/components/dashboard/teams/invite-dialog"
import { Trash2 } from "lucide-react"

export default async function TeamsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch tenants for this user
  const { data: tenantProfiles } = await supabase
    .from("tenant_profiles")
    .select("tenant_id, role")
    .eq("profile_id", user.id)

  if (!tenantProfiles || tenantProfiles.length === 0) {
    redirect("/onboarding")
  }

  // For MVP, we take the first tenant. In a real app, we might check query params or current context.
  const currentTenantId = tenantProfiles[0].tenant_id
  const currentUserRole = tenantProfiles[0].role

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", currentTenantId)
    .single()
    
  // Fetch members
  const { data: members } = await supabase
    .from("tenant_profiles")
    .select(`
        role,
        profile:profiles(id, full_name, email, avatar_url)
    `)
    .eq("tenant_id", currentTenantId)

  // Fetch invitations
  const { data: invitations } = await supabase
    .from("tenant_invitations")
    .select("*")
    .eq("tenant_id", currentTenantId)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Team Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage members and invitations for <strong>{tenant?.name}</strong>.
        </p>
      </div>

      {/* Members List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
                <CardTitle>Members</CardTitle>
                <CardDescription>Active members of this team.</CardDescription>
            </div>
            {currentUserRole === 'owner' && <InviteMemberDialog tenantId={currentTenantId} />}
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
            {members?.map((member: any) => (
                <div key={member.profile.id} className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src={member.profile.avatar_url} />
                            <AvatarFallback>{member.profile.email?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium leading-none">{member.profile.full_name || member.profile.email?.split('@')[0]}</p>
                            <p className="text-sm text-muted-foreground">{member.profile.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                         <Badge variant={member.role === 'owner' ? "default" : "secondary"}>
                            {member.role}
                        </Badge>
                        {currentUserRole === 'owner' && member.profile.id !== user.id && (
                             <form action={removeMember}>
                                <input type="hidden" name="tenant_id" value={currentTenantId} />
                                <input type="hidden" name="profile_id" value={member.profile.id} />
                                <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                             </form>
                        )}
                    </div>
                </div>
            ))}
        </CardContent>
      </Card>
      
      {/* Invitations List */}
       {invitations && invitations.length > 0 && (
        <Card>
            <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>People invited to join your team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {invitations.map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between space-x-4">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{invite.email}</span>
                            <span className="text-xs text-muted-foreground">Expires: {new Date(invite.expires_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                             <Badge variant="outline">{invite.role}</Badge>
                             {currentUserRole === 'owner' && (
                                <form action={cancelInvitation}>
                                    <input type="hidden" name="invite_id" value={invite.id} />
                                    <Button variant="ghost" size="sm" className="text-destructive h-8">
                                        Revoke
                                    </Button>
                                </form>
                             )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
       )}
    </div>
  )
}
