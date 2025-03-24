"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useProtectedRoute(requireAdmin: boolean = false) {
	const { isAuthenticated, isAdmin, isLoading, user } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!isLoading && !user) {
			router.push("/auth/login")
		}

		if (requireAdmin && !isAdmin) {
			router.push("/")
		}
	}, [isLoading, user, isAdmin, requireAdmin, router])

	return {
		isAuthenticated,
		isAdmin,
		isLoading,
	}
}
