"use client"

import Link from "next/link"
import { Button } from "@/components/ui"
import { AuthFormWrapper } from "./auth-form-wrapper"

export function VerifyEmailMessage() {
	return (
		<AuthFormWrapper
			title="Check your email"
			description="We've sent you a verification link. Please check your email to complete your registration."
			footer={
				<div className="space-y-4">
					<p className="text-sm text-gray-500">
						Didn't receive the email? Check your
						spam folder or try signing up again.
					</p>

					<div className="space-x-4">
						<Button variant="outline" asChild>
							<Link href="/auth/signup">
								Try Again
							</Link>
						</Button>
						<Button asChild>
							<Link href="/auth/login">
								Back to Login
							</Link>
						</Button>
					</div>
				</div>
			}
		>
			<div className="text-center text-sm text-gray-500">
				<p>
					The verification link will expire in 24
					hours.
				</p>
			</div>
		</AuthFormWrapper>
	)
}
