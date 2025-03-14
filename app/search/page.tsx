"use client"

import { useSearchParams } from "next/navigation"
import { PropertiesGrid } from "@/components/features/properties"
import { usePropertyManager } from "@/hooks/properties/use-property-manager"
import { useEffect } from "react"

export default function SearchPage() {
	const searchParams = useSearchParams()
	const query = searchParams.get("q")
	const { properties, updateFilters } = usePropertyManager()

	// Apply search query filter when query changes
	useEffect(() => {
		if (query) {
			updateFilters({ searchQuery: query })
		}
	}, [query, updateFilters])

	return (
		<main className="container mx-auto px-4 py-8">
			<h1 className="mb-6 text-2xl font-bold">
				{query ? `Search results for "${query}"` : "All Properties"}
			</h1>

			<PropertiesGrid initialProperties={properties} />
		</main>
	)
}
