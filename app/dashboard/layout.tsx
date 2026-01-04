import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TenantSwitcher from "@/components/dashboard/tenant-switcher"
import { MainNav } from "@/components/dashboard/main-nav"
import { UserNav } from "@/components/dashboard/user-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch tenants for this user
  const { data: tenantProfiles } = await supabase
    .from('tenant_profiles')
    .select('tenant_id')
    .eq('profile_id', user.id)

  if (!tenantProfiles || tenantProfiles.length === 0) {
    redirect('/onboarding')
  }

  const tenantIds = tenantProfiles.map(tp => tp.tenant_id)
  const { data: tenants } = await supabase
    .from('tenants')
    .select('*')
    .in('id', tenantIds)

  return (
    <div className="flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <TenantSwitcher tenants={tenants || []} />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        {children}
      </div>
    </div>
  )
}
