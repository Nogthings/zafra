
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createPortalSession } from "@/app/dashboard/actions"

interface MembershipCardProps {
  planActive: boolean
  subscriptionId: string | null
  currentPeriodEnd: string | null
  role: string | null
}

export function MembershipCard({
  planActive,
  subscriptionId,
  currentPeriodEnd,
  role,
}: MembershipCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Membership Status</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
            {planActive ? "Active" : "Inactive"}
            </div>
            {planActive ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">Pro</Badge>
            ) : (
                <Badge variant="secondary">Free</Badge>
            )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {subscriptionId
            ? `Sub ID: ${subscriptionId.slice(0, 8)}...`
            : "No active subscription"}
        </p>
        
        {currentPeriodEnd && (
             <p className="text-xs text-muted-foreground mt-1">
                Renews on: {new Date(currentPeriodEnd).toLocaleDateString()}
             </p>
        )}

        {role === 'owner' && (
            <div className="mt-4">
                <form action={createPortalSession}>
                    <Button variant="outline" className="w-full">
                        Manage Subscription
                    </Button>
                </form>
            </div>
        )}
      </CardContent>
    </Card>
  )
}
