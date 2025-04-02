"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useProtectedRoute(requireAdmin: boolean = false) {
	const { isAuthenticated, isAdmin, isLoading, user } = useAuth()
	const router = useRouter()

	useEffect(() => {
		// Wait until authentication state is loaded
		if (isLoading) return

		// If no user is logged in, redirect to login
		if (!user) {
			router.push("/auth/login")
			return
		}

		// If admin is required but user is not admin, redirect to home
		if (requireAdmin && user.user_metadata?.role !== "admin") {
			router.push("/")
			return
		}
	}, [isLoading, user, requireAdmin, router])

	return {
		isAuthenticated,
		isAdmin,
		isLoading,
	}
}
