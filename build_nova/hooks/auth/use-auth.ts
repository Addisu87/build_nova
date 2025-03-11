import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export function useAuth() {
	const [user, setUser] = useState<User | null>(
		null,
	)
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		// Get initial session
		supabase.auth
			.getSession()
			.then(({ data: { session } }) => {
				setUser(session?.user ?? null)
				setIsLoading(false)
			})

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setUser(session?.user ?? null)
				setIsLoading(false)
				router.refresh()
			},
		)

		return () => {
			subscription.unsubscribe()
		}
	}, [router])

	const signUp = async (
		email: string,
		password: string,
		options?: { full_name?: string },
	) => {
		try {
			const { error } =
				await supabase.auth.signUp({
					email,
					password,
					options: {
						data: options,
					},
				})
			if (error) throw error
		} catch (error) {
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
			if (error) throw error
		} catch (error) {
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
			await supabase.auth.signOut()
			router.push("/login")
		} catch (error) {
			console.error("Error signing out:", error)
		}
	}

	return {
		user,
		isLoading,
		signUp,
		signIn,
		signInWithGoogle,
		signInWithFacebook,
		signOut,
	}
}
