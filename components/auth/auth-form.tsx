// components/auth/auth-form.tsx
"use client"

import { Button } from "@/components/ui"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { AuthFormProps } from "@/types/auth"
import { Chrome, Facebook } from "lucide-react"
import { useRouter } from "next/navigation"

export function AuthForm({
	children,
	title,
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
		router.push(`?auth=${mode}`, { scroll: false })
	}

	const socialButtons = (onGoogleClick || onFacebookClick) && (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-3">
				{onGoogleClick && (
					<Button
						type="button"
						variant="outline"
						onClick={onGoogleClick}
						disabled={isLoading}
						className="w-full"
						size="sm"
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
						className="w-full"
						size="sm"
					>
						<Facebook className="mr-2 h-4 w-4" />
						Facebook
					</Button>
				)}
			</div>
		</div>
	)

	const footerLinks = (
		<CardFooter className="flex flex-col space-y-4 px-6 pb-6 pt-2">
			{linkText && linkLabel && (
				<div className="text-center text-sm text-muted-foreground">
					{linkText}{" "}
					<button
						onClick={() => handleAuthChange(linkLabel.toLowerCase().replace(" ", "-"))}
						className="underline hover:text-primary"
					>
						{linkLabel}
					</button>
				</div>
			)}
			{showForgotPassword && (
				<button
					onClick={() => handleAuthChange("reset-password")}
					className="text-center text-sm text-muted-foreground underline hover:text-primary"
				>
					Forgot password?
				</button>
			)}
		</CardFooter>
	)

	return (
		<Card className="border-none shadow-none">
			<CardHeader className="space-y-1 px-6 pb-8 pt-0">
				<h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
				{description && (
					<p className="text-sm text-muted-foreground">{description}</p>
				)}
			</CardHeader>
			<CardContent className="px-6">
				{socialButtons}
				{socialButtons && <div className="relative my-4">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-white px-2 text-muted-foreground">
							Or continue with
						</span>
					</div>
				</div>}
				{children}
			</CardContent>
			{footerLinks}
		</Card>
	)
}
