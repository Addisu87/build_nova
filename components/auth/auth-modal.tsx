"use client"

import {
	Dialog,
	DialogContent,
} from "@/components/ui/dialog"
import type { AuthMode } from "@/types/auth"
import { X } from "lucide-react"
import {
	useRouter,
	useSearchParams,
} from "next/navigation"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"
import { VerifyEmailMessage } from "./verify-email-message"
import { PasswordResetForm } from "./password-reset-form"

const AUTH_COMPONENTS: Record<
	AuthMode,
	React.ComponentType
> = {
	login: LoginForm,
	signup: SignupForm,
	"verify-email": VerifyEmailMessage,
	"reset-password": PasswordResetForm,
}

export function AuthModal() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const mode = searchParams.get(
		"auth",
	) as AuthMode | null

	const isOpen =
		mode !== null && mode in AUTH_COMPONENTS
	const AuthComponent = mode
		? AUTH_COMPONENTS[mode]
		: null

	const onClose = () => {
		router.back()
	}

	if (!AuthComponent) return null

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="overflow-hidden sm:max-w-[400px] p-0 gap-0">
				<div className="relative flex h-12 items-center border-b px-4">
					<button
						onClick={onClose}
						className="absolute left-4 rounded-full p-1 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<X className="h-4 w-4" />
						<span className="sr-only">Close</span>
					</button>
					<div className="flex-1 text-center">
						<span className="text-sm font-semibold">
							{mode === "login" && "Log in"}
							{mode === "signup" && "Sign up"}
							{mode === "verify-email" &&
								"Check your email"}
							{mode === "reset-password" &&
								"Reset password"}
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
