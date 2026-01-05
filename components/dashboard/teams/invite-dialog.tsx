"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { inviteUser } from "@/app/dashboard/teams/actions"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner" 

export function InviteMemberDialog({ tenantId }: { tenantId: string }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    formData.append("tenant_id", tenantId)
    
    const result = await inviteUser(formData)
    
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Invitation sent successfully")
      setOpen(false)
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Teammate</DialogTitle>
          <DialogDescription>
            Invite a new member to your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue="member">
                <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                </SelectContent>
                </Select>
            </div>
            </div>
            <DialogFooter>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Invitation"}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
