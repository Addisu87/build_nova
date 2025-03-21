"use client"

import { PropertyListing } from "@/components/features/properties/property-listing"
import { Hero } from "@/components/features/hero"
import { mockProperties } from "@/mock-data/properties"

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
					<PropertyListing
						title="Latest Properties"
						initialProperties={mockProperties}
					/>
				</section>
			</main>
		</div>
	)
}
