// components/auth/auth-form.tsx
"use client"

import { Button } from "@/components/ui"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { AuthFormProps } from "@/types/auth"
import { Chrome, Facebook } from "lucide-react"
import { useRouter } from "next/navigation"

export function AuthForm({
	children,
	description,
	linkText,
	linkLabel,
	showForgotPassword = false,
	onGoogleClick,
	onFacebookClick,
	isLoading = false,
}: AuthFormProps) {
	const router = useRouter()

	const handleAuthChange = (mode: string) => {
		// Convert "Sign Up" to "signup" and "Log In" to "login"
		const authMode = mode.toLowerCase().replace(/\s+/g, "")
		router.push(`?auth=${authMode}`, { scroll: false })
	}

	const socialButtons = (onGoogleClick || onFacebookClick) && (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				{onGoogleClick && (
					<Button
						type="button"
						variant="outline"
						onClick={onGoogleClick}
						disabled={isLoading}
						className="w-full h-10"
						size="lg"
					>
						<Chrome className="mr-2 h-4 w-4" />
						Google
					</Button>
				)}
				{onFacebookClick && (
					<Button
						type="button"
						variant="outline"
						onClick={onFacebookClick}
						disabled={isLoading}
						className="w-full h-10"
						size="lg"
					>
						<Facebook className="mr-2 h-4 w-4" />
						Facebook
					</Button>
				)}
			</div>
		</div>
	)

	return (
		<Card className="border-none shadow-none">
			<CardHeader className="space-y-2 px-0 pb-8 pt-0">
				{description && <p className="text-sm text-muted-foreground">{description}</p>}
			</CardHeader>
			<CardContent className="px-0 space-y-4">
				{socialButtons}
				{socialButtons && (
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>
				)}
				{children}
			</CardContent>
			<CardFooter className="flex flex-col space-y-4 px-0 pb-6 pt-4">
				{linkText && linkLabel && (
					<div className="text-center text-sm text-muted-foreground">
						{linkText}{" "}
						<button
							onClick={() => handleAuthChange(linkLabel)}
							className="underline hover:text-primary font-medium transition-colors"
						>
							{linkLabel}
						</button>
					</div>
				)}
				{showForgotPassword && (
					<button
						onClick={() => handleAuthChange("reset-password")}
						className="text-center text-sm text-muted-foreground underline hover:text-primary transition-colors"
					>
						Forgot password?
					</button>
				)}
			</CardFooter>
		</Card>
	)
}
