"use client"

import { useAuth } from "@/contexts/auth-context"
import { useProtectedRoute } from "@/hooks/auth/use-protected-route"
import { AdminDashboard } from "@/components/auth/admin-dashboard"
import { LoadingState } from "@/components/ui/loading-state"

export default function AdminPage() {
	const { user, isLoading } = useAuth()
	const { isAuthenticated } = useProtectedRoute(true)

	if (isLoading) {
		return <LoadingState type="default" />
	}

	if (!isAuthenticated || user?.user_metadata?.role !== "admin") {
		return null
	}

	return <AdminDashboard />
}
