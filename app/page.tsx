"use client"

import { PropertiesGrid } from "@/components/features/properties"
import { FeaturedCarousel } from "@/components/features"
import { Hero } from "@/components/features/hero"
import { mockProperties } from "@/components/features/properties/mock-data"

export default function HomePage() {
	return (
		<main className="container mx-auto px-4 py-8">
			<section className="mb-12">
				<Hero />
			</section>

			<section className="mb-12">
				<h2 className="mb-6 text-2xl font-semibold">
					Featured Properties
				</h2>
				<FeaturedCarousel
					properties={mockProperties.slice(0, 6)}
				/>
			</section>

			<section>
				<h2 className="mb-6 text-2xl font-semibold">
					Latest Properties
				</h2>
				<PropertiesGrid />
			</section>
		</main>
	)
}
