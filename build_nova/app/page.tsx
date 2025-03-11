"use client"

import { PropertiesGrid } from "@/features/properties"
import { SearchBar } from "@/components/layout/search-bar"
import { FeaturedCarousel } from "@/features/home"
import { mockProperties } from "@/features/properties/mock-data"

export default function HomePage() {
	return (
		<main className="container mx-auto px-4 py-8">
			<section className="mb-12">
				<h1 className="mb-6 text-4xl font-bold">
					Find Your Dream Home
				</h1>
				<SearchBar />
			</section>

			<section className="mb-12">
				<h2 className="mb-6 text-2xl font-semibold">
					Featured Properties
				</h2>
				<FeaturedCarousel
					properties={mockProperties.slice(0, 5)}
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
