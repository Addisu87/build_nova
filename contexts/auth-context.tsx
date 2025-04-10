"use client"

import { supabase } from "@/lib/supabase/client"
import type { Session, User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

// Constants
const GUEST_FAVORITES_KEY = "guest_favorites"
const EMAIL_RATE_LIMIT = 60 * 1000 // 60 seconds

// Types
interface AuthState {
	user: User | null
	session: Session | null
	isLoading: boolean
	emailRateLimitEnds: number | null
	favorites: string[]
	processingActions: Set<string>
}

interface AuthContextType extends AuthState {
	// Auth methods
	signUp: (email: string, password: string) => Promise<void>
	signIn: (email: string, password: string) => Promise<void>
	signInWithGoogle: () => Promise<void>
	signInWithFacebook: () => Promise<void>
	signOut: () => Promise<void>
	resetPassword: (email: string) => Promise<void>
	updatePassword: (newPassword: string) => Promise<void>

	// Email rate limiting
	canSendEmail: () => boolean
	getTimeUntilNextEmail: () => number

	// Favorites management
	toggleFavorite: (propertyId: string) => Promise<void>
	isFavorite: (propertyId: string) => boolean
	migrateGuestFavorites: () => Promise<void>

	// Loading state
	isProcessing: (action: string) => boolean
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<AuthState>({
		user: null,
		session: null,
		isLoading: true,
		emailRateLimitEnds: null,
		favorites: [],
		processingActions: new Set(),
	})

	const router = useRouter()

	// Helper functions
	const updateState = (updates: Partial<AuthState>) => {
		setState((prev) => ({ ...prev, ...updates }))
	}

	const withProcessing = async (action: string, callback: () => Promise<void>) => {
		const addProcessingAction = () => {
			setState((prev) => ({
				...prev,
				processingActions: new Set([...prev.processingActions, action]),
			}))
		}

		const removeProcessingAction = () => {
			setState((prev) => ({
				...prev,
				processingActions: new Set(
					[...prev.processingActions].filter((a) => a !== action),
				),
			}))
		}

		addProcessingAction()
		try {
			await callback()
		} finally {
			removeProcessingAction()
		}
	}

	// Load initial favorites
	useEffect(() => {
		if (state.user) {
			// Load authenticated user favorites from Supabase
			loadAuthenticatedFavorites()
		} else {
			// Load guest favorites from localStorage
			const stored = localStorage.getItem(GUEST_FAVORITES_KEY)
			if (stored) {
				setState((prev) => ({
					...prev,
					favorites: JSON.parse(stored),
				}))
			}
		}
	}, [state.user])

	// Save guest favorites to localStorage
	useEffect(() => {
		if (!state.user) {
			localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(state.favorites))
		}
	}, [state.favorites, state.user])

	// Auth state management
	useEffect(() => {
		if (typeof window === "undefined") return

		const initializeAuth = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession()
			updateState({
				session,
				user: session?.user ?? null,
				isLoading: false,
			})
		}

		initializeAuth()

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			updateState({
				session,
				user: session?.user ?? null,
				isLoading: false,
			})
			router.refresh()
		})

		return () => subscription.unsubscribe()
	}, [supabase.auth, router])

	// Email rate limiting methods
	const canSendEmail = () => {
		if (!state.emailRateLimitEnds) return true
		return Date.now() >= state.emailRateLimitEnds
	}

	const getTimeUntilNextEmail = () => {
		if (!state.emailRateLimitEnds) return 0
		const timeLeft = state.emailRateLimitEnds - Date.now()
		return timeLeft > 0 ? timeLeft : 0
	}

	const handleEmailRateLimit = () => {
		setState((prev) => ({
			...prev,
			emailRateLimitEnds: Date.now() + EMAIL_RATE_LIMIT,
		}))
	}

	// Favorites management methods
	const loadAuthenticatedFavorites = async () => {
		const { data, error } = await supabase
			.from("favorites")
			.select("property_id")
			.eq("user_id", state.user!.id)

		if (!error && data) {
			setState((prev) => ({
				...prev,
				favorites: data.map((f) => f.property_id),
			}))
		}
	}

	const toggleFavorite = async (propertyId: string) => {
		await withProcessing(`toggle-favorite-${propertyId}`, async () => {
			if (state.user) {
				// Handle authenticated favorites
				if (state.favorites.includes(propertyId)) {
					await supabase
						.from("favorites")
						.delete()
						.eq("user_id", state.user.id)
						.eq("property_id", propertyId)
				} else {
					await supabase.from("favorites").insert({
						user_id: state.user.id,
						property_id: propertyId,
					})
				}
				await loadAuthenticatedFavorites()
			} else {
				// Handle guest favorites
				setState((prev) => ({
					...prev,
					favorites: prev.favorites.includes(propertyId)
						? prev.favorites.filter((id) => id !== propertyId)
						: [...prev.favorites, propertyId],
				}))
			}

			toast.success(
				state.favorites.includes(propertyId)
					? "Removed from favorites"
					: "Added to favorites",
			)
		})
	}

	const isFavorite = (propertyId: string): boolean => {
		return state.favorites.includes(propertyId)
	}

	const migrateGuestFavorites = async () => {
		if (!state.user || state.favorites.length === 0) return

		await withProcessing("migrate-favorites", async () => {
			try {
				const guestFavorites = [...state.favorites]
				for (const propertyId of guestFavorites) {
					await supabase
						.from("favorites")
						.insert({
							user_id: state.user!.id,
							property_id: propertyId,
						})
						.select()
				}
				localStorage.removeItem(GUEST_FAVORITES_KEY)
				await loadAuthenticatedFavorites()
				toast.success("Favorites synchronized successfully")
			} catch (error) {
				toast.error("Failed to sync favorites")
				console.error("Failed to migrate guest favorites:", error)
			}
		})
	}

	const signUp = async (email: string, password: string) => {
		await withProcessing("signup", async () => {
			// Check email rate limit
			if (!canSendEmail()) {
				const timeLeft = Math.ceil(getTimeUntilNextEmail() / 1000)
				throw new Error(`Please wait ${timeLeft} seconds before trying again.`)
			}

			try {
				// Check if this is the first user signing up
				const {
					data: { users },
					error: adminError,
				} = await supabase.from("profiles").select("id").limit(1)

				if (adminError) throw adminError

				const isFirstUser = users?.length === 0

				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: {
							role: isFirstUser ? "admin" : "user",
						},
						emailRedirectTo: `${window.location.origin}/auth/callback`,
					},
				})

				if (error) throw error

				handleEmailRateLimit()
				toast.success("Verification email sent")
				router.push("/auth/verify-email")
			} catch (error) {
				toast.error("Sign up failed")
				throw error
			}
		})
	}

	const signIn = async (email: string, password: string) => {
		await withProcessing("signin", async () => {
			try {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password,
				})
				if (error) {
					if (error.message.includes("Invalid login credentials")) {
						throw new Error("Invalid email or password. Please try again.")
					}
					if (error.message.includes("Email not confirmed")) {
						throw new Error("Please verify your email before signing in.")
					}
					throw error
				}
				toast.success("Welcome back!", {
					description: "You've successfully signed in.",
				})
				window.location.href = "/"
			} catch (error: any) {
				toast.error("Sign in failed", {
					description: error.message,
				})
				throw error
			}
		})
	}

	const signInWithGoogle = async () => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
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
			const { error } = await supabase.auth.signInWithOAuth({
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
		await withProcessing("signout", async () => {
			try {
				const { error } = await supabase.auth.signOut()
				if (error) throw error
				toast.success("Signed out", {
					description: "You've been successfully signed out.",
				})
				window.location.href = "/"
			} catch (error: any) {
				toast.error("Sign out failed", {
					description: error.message,
				})
			}
		})
	}

	const resetPassword = async (email: string) => {
		await withProcessing("reset-password", async () => {
			try {
				if (!canSendEmail()) {
					const timeLeft = Math.ceil(getTimeUntilNextEmail() / 1000)
					throw new Error(
						`Please wait ${timeLeft} seconds before requesting another reset.`,
					)
				}
				const { error } = await supabase.auth.resetPasswordForEmail(email, {
					redirectTo: `${window.location.origin}/auth/update-password`,
				})
				if (error) throw error
				handleEmailRateLimit()
				toast.success("Password reset email sent", {
					description: "Please check your email for the password reset link.",
				})
			} catch (error: any) {
				toast.error("Password reset failed", {
					description: error.message,
				})
				throw error
			}
		})
	}

	const updatePassword = async (newPassword: string) => {
		await withProcessing("update-password", async () => {
			try {
				const { error } = await supabase.auth.updateUser({
					password: newPassword,
				})
				if (error) throw error
			} catch (error) {
				throw error
			}
		})
	}

	const contextValue: AuthContextType = {
		...state,
		signUp,
		signIn,
		signInWithGoogle,
		signInWithFacebook,
		signOut,
		resetPassword,
		updatePassword,
		canSendEmail,
		getTimeUntilNextEmail,
		toggleFavorite,
		isFavorite,
		migrateGuestFavorites,
		isProcessing: (action: string) => state.processingActions.has(action),
	}

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}

	return {
		...context,
		isAdmin: context.user?.user_metadata?.role === "admin",
	}
}
