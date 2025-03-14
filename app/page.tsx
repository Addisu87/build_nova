"use client"

import { PropertiesGrid } from "@/components/features/properties"
import { Hero } from "@/components/features/hero"

export default function HomePage() {
	return (
		<div className="min-h-screen bg-background">
			<main>
				{/* Hero Section */}
				<section>
					<Hero />
				</section>

				{/* Properties Grid Section */}
				<section className="container mx-auto px-4 py-16">
					<h2 className="mb-8 text-3xl font-bold tracking-tight">
						Latest Properties
					</h2>
					<PropertiesGrid />
				</section>
			</main>
		</div>
	)
}
