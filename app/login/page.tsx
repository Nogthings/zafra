import { UserAuthForm } from "@/components/auth/auth-form"
import { ModeToggle } from "@/components/mode-toggle"
import { Command } from "lucide-react"

export default function LoginPage() {
  return (
    <>
      <div className="absolute right-4 top-4 md:right-8 md:top-8 z-50">
        <ModeToggle />
      </div>
      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Command className="mr-2 h-6 w-6" />
            Zafra Inc
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
             {/* Added simple header for mobile alignment */}
             <div className="flex flex-col space-y-2 text-center lg:hidden">
                <div className="flex justify-center items-center font-bold text-2xl">
                    <Command className="mr-2 h-6 w-6" />
                    Zafra Inc
                </div>
             </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  )
}
