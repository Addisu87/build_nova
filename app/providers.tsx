"use client"

import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/lib/theme/theme-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"

// Default query client options
const defaultQueryClientOptions = {
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000, // 1 minute
			refetchOnWindowFocus: false,
			retry: 1,
		},
		mutations: {
			retry: 1,
		},
	},
}

export function Providers({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false)
	const [queryClient] = useState(() => new QueryClient(defaultQueryClientOptions))

	// Prevent theme flash on load
	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null
	}

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<AuthProvider>
					{children}
					<Toaster />
				</AuthProvider>
			</ThemeProvider>
		</QueryClientProvider>
	)
}
