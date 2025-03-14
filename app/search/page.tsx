"use client"

import { useSearchParams } from "next/navigation"
import { PropertyListing } from "@/components/features/properties/property-listing"
import { mockProperties } from "@/components/features/properties/mock-data"

export default function SearchPage() {
	const searchParams = useSearchParams()
	const query = searchParams.get("q")

	return (
		<main className="container mx-auto px-4 py-8">
			<PropertyListing
				initialProperties={mockProperties}
				initialSearchQuery={query || ""}
				title={query ? `Search results for "${query}"` : "All Properties"}
			/>
		</main>
	)
}
