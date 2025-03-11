"use client"

import { useRouter } from "next/navigation"
import {
	Facebook,
	Chrome,
} from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { useAuthForm } from "@/hooks/auth/use-auth-form"
import { loginSchema } from "@/lib/auth/schemas"
import { AuthForm } from "./auth-form"
import {
	Input,
	Button,
	Label,
} from "@/components/ui"

export function LoginForm() {
	const router = useRouter()
	const {
		signIn,
		signInWithGoogle,
		signInWithFacebook,
	} = useAuth()

	const { handleSubmit, isLoading, errors } =
		useAuthForm({
			schema: loginSchema,
			onSubmit: async (data) => {
				await signIn(data.email, data.password)
				router.push("/")
			},
		})

	const handleGoogleSignIn = async () => {
		try {
			await signInWithGoogle()
		} catch (error) {
			console.error(
				"Google sign in error:",
				error,
			)
		}
	}

	const handleFacebookSignIn = async () => {
		try {
			await signInWithFacebook()
		} catch (error) {
			console.error(
				"Facebook sign in error:",
				error,
			)
		}
	}

	return (
		<AuthForm
			title="Welcome back"
			description="Sign in to your account"
			forgotPasswordLink={true}
			linkText="Don't have an account?"
			linkHref="/auth/signup"
			linkLabel="Sign up"
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

				<div className="relative my-4">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="bg-white px-2 text-gray-500">
							Or continue with
						</span>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<Button
						type="button"
						variant="outline"
						className="w-full"
						onClick={handleGoogleSignIn}
					>
						<Chrome className="mr-2 h-4 w-4" />
						Google
					</Button>
					<Button
						type="button"
						variant="outline"
						className="w-full"
						onClick={handleFacebookSignIn}
					>
						<Facebook className="mr-2 h-4 w-4" />
						Facebook
					</Button>
				</div>
			</form>
		</AuthForm>
	)
}
