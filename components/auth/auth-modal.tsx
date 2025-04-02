"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminDashboard } from "./admin-dashboard"
import { LoginForm } from "./login-form"
import { PasswordResetForm } from "./password-reset-form"
import { SignupForm } from "./signup-form"
import { VerifyEmailMessage } from "./verify-email-message"

const AUTH_COMPONENTS = {
	login: LoginForm,
	signup: SignupForm,
	"verify-email": VerifyEmailMessage,
	"reset-password": PasswordResetForm,
	admin: AdminDashboard,
} as const

const MODAL_TITLES = {
	login: "Log in",
	signup: "Sign Up",
	"verify-email": "Check your email",
	"reset-password": "Reset your password",
	admin: "Admin Dashboard",
} as const

type AuthComponentKey = keyof typeof AUTH_COMPONENTS

export function AuthModal() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const componentKey = searchParams.get("auth") as AuthComponentKey | null

	const isOpen = componentKey !== null && componentKey in AUTH_COMPONENTS
	const AuthComponent = componentKey ? AUTH_COMPONENTS[componentKey] : null
	const modalTitle = componentKey ? MODAL_TITLES[componentKey] : ""

	const onClose = () => {
		router.push(window.location.pathname, { scroll: false })
	}

	if (!AuthComponent) return null

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="overflow-hidden sm:max-w-[425px] md:max-w-[450px] p-0 gap-0">
				<DialogTitle className="px-6 pt-8 text-2xl font-semibold tracking-tight">
					{modalTitle}
				</DialogTitle>
				<div className="px-6 py-8">
					<AuthComponent />
				</div>
			</DialogContent>
		</Dialog>
	)
}
