import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { ModeToggle } from "@/components/mode-toggle"

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
    <div className="h-full relative">
       {/* Desktop Sidebar */}
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-50">
        <Sidebar tenants={tenants || []} user={user} />
      </div>

       {/* Main Content */}
      <main className="md:pl-72 h-full">
         {/* Mobile Header */}
        <div className="flex items-center p-4 border-b md:hidden">
             <MobileSidebar tenants={tenants || []} user={user} />
             <div className="ml-auto">
                 <ModeToggle />
             </div>
        </div>
        
        {/* Children (Dashboard Content) */}
        <div className="p-8 pt-6 h-full overflow-y-auto">
             {/* Desktop Mode Toggle - positioned absolute or maybe just in the sidebar? 
                 In standard dashboard layouts, if sidebar has user nav, maybe mode toggle is there too?
                 My Sidebar didn't have ModeToggle. I should probably add it or put it in the top right of the main content area for desktop?
                 Or just leave it out for now on desktop if not requested, but usually it's needed.
                 The previous layout had it in the top bar.
                 I'll add it to the top right of the main content area for desktop as a utility bar or just float it?
                 Or better: Add it to the Sidebar user area or bottom. 
                 For now, I'll adding a small header area in the main content for purely utility things if needed, or just let it be.
                 Actually, looking at the previous layout, there was a UserNav and ModeToggle.
                 I put UserNav in the Sidebar. I didn't put ModeToggle in Sidebar.
                 I'll update Sidebar to include ModeToggle near UserNav or just render it in the desktop main area top right.
            */}
             <div className="flex flex-col h-full">
                {/* Optional: Add a top bar for desktop if we want the toggle there, OR update sidebar later.
                    For now, I'll place the mode toggle in the top-right of the content area for desktop, 
                    or just accept it's only on mobile header for now? No, that's bad.
                    I'll add it to the Sidebar in a future step or just right here.
                */}
                <div className="hidden md:flex justify-end mb-4">
                    <ModeToggle />
                </div>
                 {children}
             </div>
        </div>
      </main>
    </div>
  )
}
