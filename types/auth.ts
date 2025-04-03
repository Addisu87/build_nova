export type AuthMode = "login" | "signup" | "verify-email" | "reset-password" | "admin"

export interface AuthFormProps {
	children: React.ReactNode
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
	confirmPassword: string
}

export interface ResetPasswordFormData {
	email: string
}

export type UserRole = "admin" | "user"
