"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { useAuth } from "@/contexts/auth-context"
import { useAuthForm } from "@/hooks/auth/use-auth-form"
import { loginSchema } from "@/lib/auth/schemas"
import { AuthFormWrapper } from "./auth-form-wrapper"
import {
	Input,
	Button,
	Label,
} from "@/components/ui"

export function LoginForm() {
	const router = useRouter()
	const { signIn } = useAuth()

	const { handleSubmit, isLoading, errors } =
		useAuthForm({
			schema: loginSchema,
			onSubmit: async (data) => {
				await signIn(data.email, data.password)
				router.push("/")
			},
		})

	return (
		<AuthFormWrapper
			title="Welcome back"
			description="Sign in to your account"
			footer={
				<>
					<div className="space-y-4">
						<Link
							href="/auth/reset-password"
							className="text-blue-600 hover:underline"
						>
							Forgot your password?
						</Link>
					</div>
					<div className="mt-4">
						Don't have an account?{" "}
						<Link
							href="/auth/signup"
							className="text-blue-600 hover:underline"
						>
							Sign up
						</Link>
					</div>
				</>
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
					<Label htmlFor="password">
						Password
					</Label>
					<Input
						id="password"
						name="password"
						type="password"
						required
						autoComplete="current-password"
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

				<Button
					type="submit"
					className="w-full"
					disabled={isLoading}
				>
					{isLoading
						? "Signing in..."
						: "Sign In"}
				</Button>
			</form>
		</AuthFormWrapper>
	)
}
