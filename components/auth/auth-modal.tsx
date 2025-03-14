"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"
import { X } from "lucide-react"

export function AuthModal() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("auth")

  const isOpen = mode === "login" || mode === "signup"

  const onClose = () => {
    router.back()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {mode === "login" && <LoginForm />}
        {mode === "signup" && <SignupForm />}
      </DialogContent>
    </Dialog>
  )
}