import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Navbar } from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { AuthModal } from "@/components/auth/auth-modal"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Nova - Find Your Dream Home",
	description:
		"Search and find your perfect property with Nova",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<Providers>
					<div className="flex min-h-screen flex-col">
						<Navbar />
						<main className="flex-1">
							{children}
						</main>
						<Footer />
					</div>
					<AuthModal />
				</Providers>
			</body>
		</html>
	)
}
