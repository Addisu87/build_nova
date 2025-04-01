"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { AuthMode } from "@/types/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { LoginForm } from "./login-form"
import { PasswordResetForm } from "./password-reset-form"
import { SignupForm } from "./signup-form"
import { VerifyEmailMessage } from "./verify-email-message"

const AUTH_COMPONENTS: Record<AuthMode, React.ComponentType> = {
	login: LoginForm,
	signup: SignupForm,
	"verify-email": VerifyEmailMessage,
	"reset-password": PasswordResetForm,
}

export function AuthModal() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const mode = searchParams.get("auth") as AuthMode | null

	const isOpen = mode !== null && mode in AUTH_COMPONENTS
	const AuthComponent = mode ? AUTH_COMPONENTS[mode] : null

	const onClose = () => {
		router.back()
	}

	if (!AuthComponent) return null

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="overflow-hidden sm:max-w-[400px] p-0 gap-0">
				<div className="flex h-12 items-center border-b px-4">
					<div className="flex-1 text-center">
						<span className="text-sm font-semibold">
							{mode === "login" && "Log in"}
							{mode === "signup" && "Sign up"}
							{mode === "verify-email" && "Check your email"}
							{mode === "reset-password" && "Reset password"}
						</span>
					</div>
				</div>

				<div className="px-4 py-8">
					<AuthComponent />
				</div>
			</DialogContent>
		</Dialog>
	)
}
