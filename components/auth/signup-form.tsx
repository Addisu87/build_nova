"use client"

import { Button, Input, Label } from "@/components/ui"
import { useAuth } from "@/contexts/auth-context"
import { useAuthForm } from "@/hooks/auth/use-auth-form"
import { signupSchema } from "@/lib/auth/auth-schemas"
import type { z } from "zod"
import { AuthForm } from "./auth-form"

type SignupFormData = z.infer<typeof signupSchema>

export function SignupForm() {
	const { signUp, signInWithGoogle, signInWithFacebook, isProcessing } = useAuth()

	const { handleSubmit, register, errors, isLoading } = useAuthForm<SignupFormData>({
		schema: signupSchema,
		onSubmit: async (data) => {
			await signUp(data.email, data.password)
			window.location.href = "/auth/verify-email"
		},
	})

	return (
		<AuthForm
			title="Sign Up"
			description="Create an account to get started"
			linkText="Already have an account?"
			linkLabel="Sign in"
			onGoogleClick={signInWithGoogle}
			onFacebookClick={signInWithFacebook}
			isLoading={isLoading || isProcessing("signup")}
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email" className="text-sm font-medium">
						Email
					</Label>
					<Input
						id="email"
						type="email"
						placeholder="name@example.com"
						autoCapitalize="none"
						autoComplete="email"
						autoCorrect="off"
						disabled={isLoading || isProcessing("signup")}
						className="w-full"
						{...register("email")}
						aria-describedby={errors.email ? "email-error" : undefined}
					/>
					{errors.email && (
						<p id="email-error" className="text-sm text-destructive">
							{errors.email}
						</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="password" className="text-sm font-medium">
						Password
					</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						autoComplete="new-password"
						disabled={isLoading || isProcessing("signup")}
						className="w-full"
						{...register("password")}
						aria-describedby={errors.password ? "password-error" : undefined}
					/>
					{errors.password && (
						<p id="password-error" className="text-sm text-destructive">
							{errors.password}
						</p>
					)}
				</div>

				<Button
					type="submit"
					className="w-full"
					disabled={isLoading || isProcessing("signup")}
				>
					{isLoading || isProcessing("signup")
						? "Creating account..."
						: "Create account"}
				</Button>
			</form>
		</AuthForm>
	)
}
