// components/auth/auth-form.tsx
"use client"

import { Button } from "@/components/ui"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { AuthFormProps } from "@/types/auth"
import { Chrome, Facebook } from "lucide-react"
import Link from "next/link"

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

			<div className="relative my-4">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>
		</div>
	)

	const footerLinks = (
		<CardFooter className="flex flex-col space-y-4 px-6 pb-6 pt-2">
			{linkText && linkLabel && (
				<div className="text-center text-sm text-muted-foreground">
					{linkText}{" "}
					<Link
						href={`?auth=${linkLabel.toLowerCase().replace(" ", "-")}`}
						className="underline hover:text-primary"
						shallow={true}
					>
						{linkLabel}
					</Link>
				</div>
			)}
			{showForgotPassword && (
				<Link
					href="?auth=reset-password"
					className="text-center text-sm text-muted-foreground underline hover:text-primary"
					shallow={true}
				>
					Forgot password?
				</Link>
			)}
		</CardFooter>
	)

	return (
		<Card className="w-full border-0 shadow-none">
			<CardHeader className="space-y-1 px-6 pt-6 pb-2">
				<h2 className="text-2xl font-bold text-left">{title}</h2>
				{description && (
					<p className="text-left text-sm text-muted-foreground">{description}</p>
				)}
			</CardHeader>
			<CardContent className="space-y-4 p-6 pt-2">
				{socialButtons}
				{children}
			</CardContent>
			{(linkText || showForgotPassword) && footerLinks}
		</Card>
	)
}
