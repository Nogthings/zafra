'use client'

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
// We will import the actions, but they need to be passed or invoked carefully from the client
// Actually better to keep the actions in the server component or just pass them as props?
// For simplicity in this demo, we will bind them in the parent or import directly since they are server actions.
import { login, signup } from "@/app/login/actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Loader2, Mail } from "lucide-react"
import { Icons } from "@/components/icons"

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)
  const [mode, setMode] = React.useState<'login' | 'signup'>('login')
  
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    // In a real app we might want to use client-side validation here
    // For now we just submit the form to the server action
    // But since we are intercepting submission, we need to gather data manually
    // OR we can just use the form action directly on the button/form
    
    // To keep the loading state working, we can wrap the action
    const target = event.target as typeof event.target & {
      email: { value: string }
      password: { value: string }
      full_name?: { value: string }
    }

    const formData = new FormData()
    formData.append('email', target.email.value)
    formData.append('password', target.password.value)
    
    if (mode === 'signup' && target.full_name) {
      formData.append('full_name', target.full_name.value)
    }

    try {
        if (mode === 'login') {
            await login(formData)
        } else {
            await signup(formData)
        }
    } catch (error) {
        // The server action redirects on success or error usually, 
        // but if it throws, we catch it here.
        console.error(error)
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === 'login' ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === 'login' 
            ? 'Enter your email to sign in to your account' 
            : 'Enter your email below to create your account'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button 
            variant={mode === 'login' ? 'default' : 'outline'} 
            onClick={() => setMode('login')}
            className="w-full"
        >
            Login
        </Button>
        <Button 
            variant={mode === 'signup' ? 'default' : 'outline'} 
            onClick={() => setMode('signup')}
            className="w-full"
        >
            Sign Up
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {error}
        </div>
      )}
      
      {message && (
        <div className="bg-green-500/15 text-green-600 text-sm p-3 rounded-md">
            {message}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
            {mode === 'signup' && (
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="full_name">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="John Doe"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="name"
                  autoCorrect="off"
                  disabled={isLoading}
                />
              </div>
            )}
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoComplete={mode === 'login' ? "current-password" : "new-password"}
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {mode === 'login' ? 'Sign In with Email' : 'Sign Up with Email'}
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isGitHubLoading}>
        {isGitHubLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        GitHub
      </Button>
      
      <p className="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="/terms" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  )
}
