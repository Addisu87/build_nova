"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export default function AuthCallbackPage() {
	const router = useRouter()

	useEffect(() => {
		supabase.auth.onAuthStateChange(
			(event, session) => {
				if (event === "SIGNED_IN") {
					router.push("/")
				} else if (event === "SIGNED_OUT") {
					router.push("/auth/login")
				}
			},
		)
	}, [router])

	return (
		<main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
				className="w-full max-w-md space-y-8 text-center"
			>
				<Skeleton className="h-8 w-48 mx-auto" />
				<p className="text-gray-600">
					Completing sign in...
				</p>
			</motion.div>
		</main>
	)
}
