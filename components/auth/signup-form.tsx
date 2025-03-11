"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
	Input,
	Button,
	Label,
} from "@/components/ui" 

import { useAuth } from "@/contexts/auth-context"
import { useAuthForm } from "@/hooks/auth/use-auth-form"
import { signupSchema } from "@/lib/auth/schemas"
import { AuthFormWrapper } from "./auth-form-wrapper"

export function SignupForm() {
	const router = useRouter()
	const { signUp } = useAuth()

	const { handleSubmit, isLoading, errors } =
		useAuthForm({
			schema: signupSchema,
			onSubmit: async (data) => {
				await signUp(
					data.email,
					data.password,
					data.fullName,
				)
				router.push("/auth/verify-email")
			},
		})

	return (
		<AuthFormWrapper
			title="Create an account"
			description="Sign up to get started"
			footer={
				<div>
					Already have an account?{" "}
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

				<div className="space-y-2">
					<Label htmlFor="fullName">
						Full Name
					</Label>
					<Input
						id="fullName"
						name="fullName"
						type="text"
						required
						autoComplete="name"
						aria-invalid={!!errors.fullName}
						aria-describedby={
							errors.fullName
								? "fullName-error"
								: undefined
						}
					/>
					{errors.fullName && (
						<p
							id="fullName-error"
							className="text-sm text-red-600"
						>
							{errors.fullName}
						</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="password">
						Password
					</Label>
					<Input
						id="password"
						name="password"
						type="password"
						required
						autoComplete="new-password"
						aria-invalid={!!errors.password}
						aria-describedby={
							errors.password
								? "password-error"
								: undefined
						}
					/>
					{errors.password && (
						<p
							id="password-error"
							className="text-sm text-red-600"
						>
							{errors.password}
						</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="confirmPassword">
						Confirm Password
					</Label>
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						required
						autoComplete="new-password"
						aria-invalid={
							!!errors.confirmPassword
						}
						aria-describedby={
							errors.confirmPassword
								? "confirm-password-error"
								: undefined
						}
					/>
					{errors.confirmPassword && (
						<p
							id="confirm-password-error"
							className="text-sm text-red-600"
						>
							{errors.confirmPassword}
						</p>
					)}
				</div>

				<Button
					type="submit"
					className="w-full"
					disabled={isLoading}
				>
					{isLoading
						? "Creating account..."
						: "Create Account"}
				</Button>
			</form>
		</AuthFormWrapper>
	)
}
