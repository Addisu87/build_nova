"use client"

import { Button, Input, Label } from "@/components/ui"
import { useAuth } from "@/contexts/auth-context"
import { useAuthForm } from "@/hooks/auth/use-auth-form"
import { loginSchema } from "@/lib/auth/auth-schemas"
import type { z } from "zod"
import { AuthForm } from "./auth-form"

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
	const { signIn, signInWithGoogle, signInWithFacebook, isProcessing } = useAuth()

	const { handleSubmit, register, errors, isLoading } = useAuthForm<LoginFormData>({
		schema: loginSchema,
		onSubmit: async (data) => {
			await signIn(data.email, data.password)
		},
	})

	return (
		<AuthForm
			title="Log in"
			description="Welcome back! Please enter your details."
			linkText="Don't have an account?"
			linkLabel="signup"
			showForgotPassword={true}
			onGoogleClick={signInWithGoogle}
			onFacebookClick={signInWithFacebook}
			isLoading={isLoading || isProcessing("signin")}
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<Label className="text-sm font-medium" htmlFor="email">
						Email
					</Label>
					<Input
						id="email"
						type="email"
						placeholder="name@example.com"
						autoComplete="email"
						disabled={isLoading || isProcessing("signin")}
						className="w-full"
						{...register("email")}
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
						type="password"
						placeholder="••••••••"
						autoComplete="current-password"
						disabled={isLoading || isProcessing("signin")}
						className="w-full"
						{...register("password")}
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
					disabled={isLoading || isProcessing("signin")}
				>
					{isLoading || isProcessing("signin") ? "Signing in..." : "Sign in"}
				</Button>
			</form>
		</AuthForm>
	)
}
