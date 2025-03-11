"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
	Button,
	Input,
	Label,
} from "@/components/ui"
import { useAuth } from "@/contexts/auth-context"
import { useAuthForm } from "@/hooks/auth/use-auth-form"
import { resetPasswordSchema } from "@/lib/auth/schemas"
import { AuthFormWrapper } from "./auth-form-wrapper"

export function PasswordResetForm() {
	const router = useRouter()
	const { resetPassword } = useAuth()

	const { handleSubmit, isLoading, errors } =
		useAuthForm({
			schema: resetPasswordSchema,
			onSubmit: async (data) => {
				await resetPassword(data.email)
				router.push("/auth/login")
			},
		})

	return (
		<AuthFormWrapper
			title="Reset your password"
			description="Enter your email address and we'll send you a link to reset your password"
			footer={
				<div>
					Remember your password?{" "}
					<Link
						href="/auth/login"
						className="text-blue-600 hover:underline"
					>
						Sign in
					</Link>
				</div>
			}
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
		</AuthFormWrapper>
	)
}
