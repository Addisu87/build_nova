"use client"

import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { useAuth } from "@/hooks/auth/use-auth"

export function Providers({
	children,
}: {
	children: React.ReactNode
}) {
	const { isLoading } = useAuth()

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			{children}
			<Toaster />
		</ThemeProvider>
	)
}
