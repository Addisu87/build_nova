"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export function useProtectedRoute(requireAdmin: boolean = false) {
	const { isAuthenticated, isAdmin, isLoading, requireAuth } = useAuth()

	useEffect(() => {
		if (requireAdmin) {
			requireAdmin()
		} else {
			requireAuth()
		}
	}, [isAuthenticated, isLoading, requireAdmin])

	return {
		isAuthenticated,
		isAdmin,
		isLoading,
	}
}
