"use client"

import { useEffect } from "react"
import {
	useRouter,
	useSearchParams,
} from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function useProtectedRoute(
	requireAdmin: boolean = false,
) {
	const { user, isLoading } = useAuth()
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		if (!isLoading && !user) {
			const redirectUrl = new URL(
				"/auth/login",
				window.location.origin,
			)
			const redirectedFrom = searchParams.get(
				"redirectedFrom",
			)
			if (redirectedFrom) {
				redirectUrl.searchParams.set(
					"redirectedFrom",
					redirectedFrom,
				)
			}
			router.push(redirectUrl.toString())
			return
		}

		if (!isLoading && user && requireAdmin) {
			const isAdmin =
				user.user_metadata?.role === "admin"
			if (!isAdmin) {
				router.push("/")
			}
		}
	}, [
		user,
		isLoading,
		router,
		searchParams,
		requireAdmin,
	])

	return {
		isAuthenticated: !!user,
		isAdmin:
			user?.user_metadata?.role === "admin",
		isLoading,
	}
}
