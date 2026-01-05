"use client"

import { Button } from "@/components/ui/button"
import { cancelInvitation } from "@/app/dashboard/teams/actions"
import { useState } from "react"
import { toast } from "sonner"

interface RevokeInvitationButtonProps {
    inviteId: string
}

export function RevokeInvitationButton({ inviteId }: RevokeInvitationButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleRevoke = async () => {
        setLoading(true)
        const formData = new FormData()
        formData.append("invite_id", inviteId)
        
        const result = await cancelInvitation(formData)
        
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success("Invitation revoked")
        }
        setLoading(false)
    }

    return (
        <Button 
            variant="ghost" 
            size="sm" 
            className="text-destructive h-8"
            onClick={handleRevoke}
            disabled={loading}
        >
            {loading ? "Revoking..." : "Revoke"}
        </Button>
    )
}
