"use client"

import {
	createContext,
	useContext,
	useEffect,
	useState,
} from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import type {
	User,
	Session,
} from "@supabase/supabase-js"

interface AuthContextType {
	user: User | null
	session: Session | null
	isLoading: boolean
	emailRateLimitEnds: number | null
	signUp: (
		email: string,
		password: string,
		fullName: string,
	) => Promise<void>
	signIn: (
		email: string,
		password: string,
	) => Promise<void>
	signInWithGoogle: () => Promise<void>
	signInWithFacebook: () => Promise<void>
	signOut: () => Promise<void>
	resetPassword: (email: string) => Promise<void>
	updatePassword: (
		newPassword: string,
	) => Promise<void>
	canSendEmail: () => boolean
	getTimeUntilNextEmail: () => number
}

const AuthContext = createContext<
	AuthContextType | undefined
>(undefined)

const EMAIL_RATE_LIMIT = 60 * 1000 // 60 seconds in milliseconds

export function AuthProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [user, setUser] = useState<User | null>(
		null,
	)
	const [session, setSession] =
		useState<Session | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [
		emailRateLimitEnds,
		setEmailRateLimitEnds,
	] = useState<number | null>(null)
	const router = useRouter()
	const supabase = createClientComponentClient()

	useEffect(() => {
		if (typeof window === "undefined") return // Ensure client-side only

		const getSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession()
			setSession(session)
			setUser(session?.user ?? null)
			setIsLoading(false)
		}

		getSession()

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session)
				setUser(session?.user ?? null)
				setIsLoading(false)
				router.refresh()
			},
		)

		return () => subscription.unsubscribe()
	}, [supabase.auth, router])

	const canSendEmail = () => {
		if (!emailRateLimitEnds) return true
		return Date.now() >= emailRateLimitEnds
	}

	const getTimeUntilNextEmail = () => {
		if (!emailRateLimitEnds) return 0
		const timeLeft =
			emailRateLimitEnds - Date.now()
		return timeLeft > 0 ? timeLeft : 0
	}

	const handleEmailRateLimit = () => {
		setEmailRateLimitEnds(
			Date.now() + EMAIL_RATE_LIMIT,
		)
	}

	const signUp = async (
		email: string,
		password: string,
		fullName: string,
	) => {
		try {
			if (!canSendEmail()) {
				const timeLeft = Math.ceil(
					getTimeUntilNextEmail() / 1000,
				)
				throw new Error(
					`Please wait ${timeLeft} seconds before trying again.`,
				)
			}

			const { error } =
				await supabase.auth.signUp({
					email,
					password,
					options: {
						data: { full_name: fullName },
					},
				})

			if (error) {
				if (
					error.message.includes(
						"unique constraint",
					)
				) {
					throw new Error(
						"This email is already registered. Please try signing in instead.",
					)
				}
				throw error
			}

			handleEmailRateLimit()
			toast.success("Verification email sent", {
				description:
					"Please check your email to verify your account.",
			})
			router.push("/auth/verify-email")
		} catch (error: any) {
			toast.error("Registration failed", {
				description: error.message,
			})
			throw error
		}
	}

	const signIn = async (
		email: string,
		password: string,
	) => {
		try {
			const { error } =
				await supabase.auth.signInWithPassword({
					email,
					password,
				})
			if (error) {
				if (
					error.message.includes(
						"Invalid login credentials",
					)
				) {
					throw new Error(
						"Invalid email or password. Please try again.",
					)
				}
				if (
					error.message.includes(
						"Email not confirmed",
					)
				) {
					throw new Error(
						"Please verify your email before signing in.",
					)
				}
				throw error
			}
			toast.success("Welcome back!", {
				description:
					"You've successfully signed in.",
			})
			window.location.href = "/"
		} catch (error: any) {
			toast.error("Sign in failed", {
				description: error.message,
			})
			throw error
		}
	}

	const signInWithGoogle = async () => {
		try {
			const { error } =
				await supabase.auth.signInWithOAuth({
					provider: "google",
					options: {
						redirectTo: `${window.location.origin}/auth/callback`,
					},
				})
			if (error) throw error
		} catch (error) {
			throw error
		}
	}

	const signInWithFacebook = async () => {
		try {
			const { error } =
				await supabase.auth.signInWithOAuth({
					provider: "facebook",
					options: {
						redirectTo: `${window.location.origin}/auth/callback`,
					},
				})
			if (error) throw error
		} catch (error) {
			throw error
		}
	}

	const signOut = async () => {
		try {
			const { error } =
				await supabase.auth.signOut()
			if (error) throw error
			toast.success("Signed out", {
				description:
					"You've been successfully signed out.",
			})
			window.location.href = "/"
		} catch (error: any) {
			toast.error("Sign out failed", {
				description: error.message,
			})
		}
	}

	const resetPassword = async (email: string) => {
		try {
			if (!canSendEmail()) {
				const timeLeft = Math.ceil(
					getTimeUntilNextEmail() / 1000,
				)
				throw new Error(
					`Please wait ${timeLeft} seconds before requesting another reset.`,
				)
			}
			const { error } =
				await supabase.auth.resetPasswordForEmail(
					email,
					{
						redirectTo: `${window.location.origin}/auth/update-password`,
					},
				)
			if (error) throw error
			handleEmailRateLimit()
			toast.success("Password reset email sent", {
				description:
					"Please check your email for the password reset link.",
			})
		} catch (error: any) {
			toast.error("Password reset failed", {
				description: error.message,
			})
			throw error
		}
	}

	const updatePassword = async (
		newPassword: string,
	) => {
		try {
			const { error } =
				await supabase.auth.updateUser({
					password: newPassword,
				})
			if (error) throw error
		} catch (error) {
			throw error
		}
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				session,
				isLoading,
				emailRateLimitEnds,
				signUp,
				signIn,
				signInWithGoogle,
				signInWithFacebook,
				signOut,
				resetPassword,
				updatePassword,
				canSendEmail,
				getTimeUntilNextEmail,
			}}
		>
			{children}{" "}
			{/* Removed <Toaster /> from here */}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error(
			"useAuth must be used within an AuthProvider",
		)
	}
	return context
}
