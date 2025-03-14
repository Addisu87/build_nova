"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui"
import { Chrome, Facebook } from "lucide-react"
import type { AuthFormProps } from "@/types/auth"

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
	const searchParams = useSearchParams()
	const isModal = searchParams.get("auth")

	const content = (
		<div className="space-y-6">
			{description && (
				<p className="text-center text-sm text-gray-600">{description}</p>
			)}

			{(onGoogleClick || onFacebookClick) && (
				<>
					<div className="grid gap-3">
						{onGoogleClick && (
							<Button
								type="button"
								variant="outline"
								onClick={onGoogleClick}
								disabled={isLoading}
							>
								<Chrome className="mr-2 h-4 w-4" />
								Continue with Google
							</Button>
						)}
						{onFacebookClick && (
							<Button
								type="button"
								variant="outline"
								onClick={onFacebookClick}
								disabled={isLoading}
							>
								<Facebook className="mr-2 h-4 w-4" />
								Continue with Facebook
							</Button>
						)}
					</div>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">or</span>
						</div>
					</div>
				</>
			)}

			{children}

			<div className="mt-6 flex flex-col gap-2 text-center text-sm">
				{linkText && linkLabel && (
					<p>
						{linkText}{" "}
						<Link
							href={`?auth=${linkLabel.toLowerCase()}`}
							className="text-primary hover:text-primary/80 hover:underline"
							shallow={true}
						>
							{linkLabel}
						</Link>
					</p>
				)}
				{showForgotPassword && (
					<Link
						href="?auth=reset-password"
						className="text-primary hover:text-primary/80 hover:underline text-sm"
						shallow={true}
					>
						Forgot password?
					</Link>
				)}
			</div>
		</div>
	)

	if (isModal) {
		return content
	}

	return (
		<div className="min-h-screen bg-gray-50 pt-16">
			<div className="container mx-auto max-w-md px-4">
				<div className="rounded-lg bg-white p-8 shadow-md">
					<h2 className="mb-6 text-center text-2xl font-bold">{title}</h2>
					{content}
				</div>
			</div>
		</div>
	)
}
