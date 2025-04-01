export type AuthMode = "login" | "signup" | "verify-email" | "reset-password"

export interface AuthFormProps {
	children: React.ReactNode
	title: string
	description?: string
	linkText?: string
	linkLabel?: string
	showForgotPassword?: boolean
	onGoogleClick?: () => Promise<void>
	onFacebookClick?: () => Promise<void>
	isLoading?: boolean
}

export interface LoginFormData {
	email: string
	password: string
}

export interface SignupFormData {
	email: string
	password: string
	fullName: string
}

export interface ResetPasswordFormData {
	email: string
}
