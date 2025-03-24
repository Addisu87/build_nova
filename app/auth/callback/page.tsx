"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"

export default function AuthCallbackPage() {
	const { session } = useAuth()

	useEffect(() => {
		// Add a small delay to ensure the session state is updated
		const timer = setTimeout(() => {
			if (session) {
				window.location.href = "/"
			} else {
				window.location.href = "/?auth=login"
			}
		}, 1000)

		return () => clearTimeout(timer)
	}, [session])

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col items-center justify-center">
				<Skeleton className="h-12 w-12 rounded-full" />
				<Skeleton className="h-4 w-48 mt-4" />
			</div>
		</div>
	)
}
