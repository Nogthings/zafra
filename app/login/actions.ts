'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in a real app, you might want to use Zod to validate the input
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=Could not authenticate user')
  }

  const next = formData.get('next') as string
 
   revalidatePath('/', 'layout')
   redirect(next || '/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string

  const next = formData.get('next') as string
  const redirectUrl = new URL(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`)
  if (next) {
    redirectUrl.searchParams.set('next', next)
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: redirectUrl.toString(),
    },
  })

  const nextParam = next ? `&next=${encodeURIComponent(next)}` : ''

  if (error) {
    redirect(`/login?error=Could not authenticate user${nextParam}`)
  }

  revalidatePath('/', 'layout')
  redirect(`/login?message=Check email to continue sign in process${nextParam}`)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
