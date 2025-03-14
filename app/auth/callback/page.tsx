"use client"

import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"

export default function AuthCallbackPage() {
	const { session, redirectToHome, redirectToLogin } = useAuth()

	useEffect(() => {
		if (session) {
			redirectToHome()
		} else {
			redirectToLogin()
		}
	}, [session])

	return (
		<div className="container mx-auto px-4 py-8">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="flex flex-col items-center justify-center"
			>
				<Skeleton className="h-12 w-12 rounded-full" />
				<Skeleton className="h-4 w-48 mt-4" />
			</motion.div>
		</div>
	)
}
