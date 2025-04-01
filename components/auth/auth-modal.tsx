"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useRouter, useSearchParams } from "next/navigation"
import { LoginForm } from "./login-form"
import { PasswordResetForm } from "./password-reset-form"
import { SignupForm } from "./signup-form"
import { VerifyEmailMessage } from "./verify-email-message"

const AUTH_COMPONENTS = {
	login: LoginForm,
	signup: SignupForm,
	"verify-email": VerifyEmailMessage,
	"reset-password": PasswordResetForm,
} as const

type AuthComponentKey = keyof typeof AUTH_COMPONENTS

export function AuthModal() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const componentKey = searchParams.get("auth") as AuthComponentKey | null

	const isOpen = componentKey !== null && componentKey in AUTH_COMPONENTS
	const AuthComponent = componentKey ? AUTH_COMPONENTS[componentKey] : null

	const onClose = () => {
		router.back()
	}

	if (!AuthComponent) return null

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="overflow-hidden sm:max-w-[400px] p-0 gap-0">
				<div className="px-4 py-8">
					<AuthComponent />
				</div>
			</DialogContent>
		</Dialog>
	)
}
