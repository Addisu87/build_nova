"use client"

import { Hero } from "@/components/features/hero"
import { PropertyListing } from "@/components/features/properties/property-listing"
import { usePropertyManager } from "@/hooks/properties/use-property-manager"

export default function HomePage() {
	const { properties } = usePropertyManager()

	return (
		<>
			<section>
				<Hero />
			</section>

			<section className="container mx-auto px-4 py-16">
				<PropertyListing
					title="Latest Properties"
					initialProperties={properties || []}
					pageSize={12}
					viewType="grid"
					showFilters={true}
				/>
			</section>
		</>
	)
}
