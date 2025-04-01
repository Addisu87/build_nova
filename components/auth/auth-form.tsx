"use client"

import { Button } from "@/components/ui"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import type { AuthFormProps } from "@/types/auth"
import { Chrome, Facebook } from "lucide-react"
import Link from "next/link"

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
	const socialButtons = (onGoogleClick || onFacebookClick) && (
		<>
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
						or continue with
					</span>
				</div>
			</div>
		</>
	)

	const footerLinks = (
		<CardFooter className="flex flex-col space-y-2 px-6 pb-6 pt-2">
			{linkText && linkLabel && (
				<p className="text-sm text-center text-muted-foreground">
					{linkText}{" "}
					<Link
						href={`?auth=${linkLabel.toLowerCase()}`}
						className="font-medium text-primary hover:text-primary/80 hover:underline"
						shallow={true}
					>
						{linkLabel}
					</Link>
				</p>
			)}
			{showForgotPassword && (
				<Link
					href="?auth=reset-password"
					className="text-sm font-medium text-primary hover:text-primary/80 hover:underline text-center"
					shallow={true}
				>
					Forgot password?
				</Link>
			)}
		</CardFooter>
	)

	return (
		<Card className="border-none shadow-none">
			{description && (
				<CardHeader className="px-6 pb-2">
					<p className="text-center text-sm text-muted-foreground">{description}</p>
				</CardHeader>
			)}
			<CardContent className="px-6">
				<div className="space-y-4">
					{socialButtons}
					{children}
				</div>
			</CardContent>
			{footerLinks}
		</Card>
	)
}
