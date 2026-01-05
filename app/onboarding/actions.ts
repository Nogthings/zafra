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
  const { error: tenantError } = await supabase
    .rpc('create_tenant_v2', {
      name,
      slug,
    })

  if (tenantError) {
    console.error('Error creating tenant:', tenantError)
    return redirect('/onboarding?error=Could not create organization')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
