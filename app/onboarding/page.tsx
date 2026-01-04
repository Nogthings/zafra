import { createTenant } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function OnboardingPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Zafra</CardTitle>
          <CardDescription>
            Let's create your first organization to get started.
          </CardDescription>
        </CardHeader>
        <form action={createTenant}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Acme Corp" 
                required 
                minLength={3}
              />
              <p className="text-xs text-muted-foreground">
                This will be your workspace name.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Create Organization</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
