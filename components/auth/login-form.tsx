"use client"

import { useAuth } from "@/contexts/auth-context"
import { useAuthForm } from "@/hooks/auth/use-auth-form"
import { loginSchema } from "@/lib/auth/auth-schemas"
import { AuthForm } from "./auth-form"
import { Input, Button, Label } from "@/components/ui"

export function LoginForm() {
  const {
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    redirectToHome,
    isProcessing
  } = useAuth()

  const { handleSubmit, errors } = useAuthForm({
    schema: loginSchema,
    onSubmit: async (data) => {
      try {
        await signIn(data.email, data.password)
        redirectToHome()
      } catch (error) {
        // Error handling is already done in useAuthForm
      }
    },
  })

  return (
    <AuthForm
      description="Enter your email below to create your account"
      linkText="Don't have an account?"
      linkLabel="Sign up"
      showForgotPassword={true}
      onGoogleClick={signInWithGoogle}
      onFacebookClick={signInWithFacebook}
      isLoading={isProcessing('signin')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="text-sm text-destructive text-center bg-destructive/10 p-3 rounded-md">
            {errors.form}
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-sm font-medium" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isProcessing('signin')}
            className="w-full"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sm font-medium text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isProcessing('signin')}
            className="w-full"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p id="password-error" className="text-sm font-medium text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isProcessing('signin')}
        >
          {isProcessing('signin') ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthForm>
  )
}
