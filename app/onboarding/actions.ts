'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createTenant(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return redirect('/login')
  }

  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

  // 1. Create Tenant using RPC function to ensure atomicity and bypass RLS visibility issues
  const { data: tenant, error: tenantError } = await supabase
    .rpc('create_tenant_v2', {
      name,
      slug,
    })

  if (tenantError) {
    console.error('Error creating tenant:', tenantError)
    return redirect('/onboarding?error=Could not create organization')
  }

  /*
  // 2. Link User to Tenant as Owner
  const { error: memberError } = await supabase
    .from('tenant_profiles')
    .insert({
      tenant_id: tenant.id,
      profile_id: user.id,
      role: 'owner',
    })

  if (memberError) {
      console.error('Error adding user to tenant:', memberError)
      // Cleanup tenant if linking fails? ideally yes, but RLS might prevent deletion if we messed up.
      return redirect('/onboarding?error=Could not create organization membership')
  }
  */

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
