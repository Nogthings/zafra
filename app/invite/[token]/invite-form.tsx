"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { acceptInvitation } from "./actions"

export function InviteForm({ token }: { token: string }) {
    const [state, action, isPending] = useActionState(acceptInvitation, null)

    return (
        <form action={action}>
            <input type="hidden" name="token" value={token} />
            {state?.error && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                    {state.error}
                </div>
            )}
            <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? "Accepting..." : "Accept Invitation"}
            </Button>
        </form>
    )
}
