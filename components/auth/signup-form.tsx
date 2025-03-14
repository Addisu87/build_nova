"use client"

import { useAuth } from "@/contexts/auth-context"
import { useAuthForm } from "@/hooks/auth/use-auth-form"
import { signupSchema } from "@/lib/auth/auth-schemas"
import { AuthForm } from "./auth-form"
import { Input, Button, Label } from "@/components/ui"

export function SignupForm() {
  const {
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    isProcessing
  } = useAuth()

  const { handleSubmit, errors } = useAuthForm({
    schema: signupSchema,
    onSubmit: async (data) => {
      await signUp(data.email, data.password)
      window.location.href = "/auth/verify-email"
    },
  })

  return (
    <AuthForm
      title="Create an account"
      linkText="Already have an account?"
      linkLabel="Sign in"
      onGoogleClick={signInWithGoogle}
      onFacebookClick={signInWithFacebook}
      isLoading={isProcessing('signup')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <p className="text-sm text-red-600">{errors.form}</p>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            className="w-full"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Create a password"
            className="w-full"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p id="password-error" className="text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isProcessing('signup')}
        >
          {isProcessing('signup') ? "Creating account..." : "Sign up"}
        </Button>
      </form>
    </AuthForm>
  )
}
