"use client"

import { useRouter } from "next/navigation"
import {
	Button,
	Input,
	Label,
} from "@/components/ui"
import { useAuth } from "@/contexts/auth-context"
import { useAuthForm } from "@/hooks/auth/use-auth-form"
import { resetPasswordSchema } from "@/lib/auth/auth-schemas"
import { AuthForm } from "./auth-form"

export function PasswordResetForm() {
	const router = useRouter()
	const { resetPassword } = useAuth()

	const { handleSubmit, isLoading, errors } =
		useAuthForm({
			schema: resetPasswordSchema,
			onSubmit: async (data) => {
				try {
					await resetPassword(data.email)
					router.push("/auth/login")
				} catch (error) {
					// Error handling is already done in useAuthForm
				}
			},
		})

	return (
		<AuthForm
			title="Reset your password"
			description="Enter your email address and we'll send you a link to reset your password"
			linkText="Remember your password?"
			linkHref="/auth/login"
			linkLabel="Sign in"
		>
			<form
				onSubmit={handleSubmit}
				className="space-y-4"
			>
				{errors.form && (
					<p className="text-sm text-red-600">
						{errors.form}
					</p>
				)}

				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						required
						autoComplete="email"
						aria-invalid={!!errors.email}
						aria-describedby={
							errors.email
								? "email-error"
								: undefined
						}
					/>
					{errors.email && (
						<p
							id="email-error"
							className="text-sm text-red-600"
						>
							{errors.email}
						</p>
					)}
				</div>

				<Button
					type="submit"
					className="w-full"
					disabled={isLoading}
				>
					{isLoading
						? "Sending reset link..."
						: "Send Reset Link"}
				</Button>
			</form>
		</AuthForm>
	)
}
