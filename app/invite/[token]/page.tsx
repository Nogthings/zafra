import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { acceptInvitation } from "./actions"

export default async function InvitePage(props: { params: Promise<{ token: string }> }) {
    const params = await props.params
    const supabase = await createClient()
    const token = params.token

    // Fetch invitation via RPC (security definer to bypass RLS)
    const { data: invitation, error } = await supabase
        .rpc('get_invitation_by_token', { lookup_token: token })

    if (error || !invitation) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle className="text-red-600">Invalid Invitation</CardTitle>
                        <CardDescription>
                            This invitation is invalid or has expired.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Check expiration
    if (new Date(invitation.expires_at) < new Date()) {
        return (
             <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle className="text-amber-600">Expired Invitation</CardTitle>
                        <CardDescription>
                             This invitation expired on {new Date(invitation.expires_at).toLocaleDateString()}.
                        </CardDescription>
                    </CardHeader>
                     <CardContent>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <Card className="w-[450px]">
                <CardHeader className="text-center">
                    <CardTitle>Join {invitation.tenant?.name || 'Team'}</CardTitle>
                    <CardDescription>
                        You have been invited to join this team.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2 text-center text-sm">
                        <p className="text-muted-foreground">
                            Invited Email: <span className="font-medium text-foreground">{invitation.email}</span>
                        </p>
                    </div>

                    {user ? (
                        <div className="space-y-4">
                            <p className="text-center text-sm text-muted-foreground">
                                You are currently logged in as <strong>{user.email}</strong>
                            </p>
                             {user.email !== invitation.email && (
                                <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
                                    Warning: You are logged in with a different email than the invitation.
                                    You can still accept, but ensure this is intended.
                                </div>
                            )}
                            <form action={acceptInvitation}>
                                <input type="hidden" name="token" value={token} />
                                <Button className="w-full" type="submit">
                                    Accept Invitation
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-4">
                             <Button asChild className="w-full">
                                <Link href={`/login?next=/invite/${token}`}>
                                    Log in to Accept
                                </Link>
                            </Button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or
                                    </span>
                                </div>
                            </div>
                            <Button asChild variant="outline" className="w-full">
                                <Link href={`/login?view=signup&next=/invite/${token}`}>
                                    Create Account
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
