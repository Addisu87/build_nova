"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase/client"
import { motion } from "framer-motion"

export default function AuthCallbackPage() {
	const router = useRouter()

	useEffect(() => {
		const handleAuthChange = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession()

			if (session) {
				// Force a hard navigation to the home page
				window.location.href = "/"
			} else {
				// If no session, redirect to login
				router.push("/auth/login")
			}
		}

		// Check auth state immediately
		handleAuthChange()

		// Also listen for auth state changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(
			(event, session) => {
				if (event === "SIGNED_IN") {
					// Force a hard navigation to the home page
					window.location.href = "/"
				} else if (event === "SIGNED_OUT") {
					router.push("/auth/login")
				}
			},
		)

		return () => subscription.unsubscribe()
	}, [router, supabase.auth])

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
