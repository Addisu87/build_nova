"use client"

import { usePropertyManager } from "@/hooks/properties/use-property-manager"
import type { Property } from "@/types"
import { PropertyFilters } from "./filters"
import { PropertiesGrid } from "./grid"

interface PropertyListingProps {
	initialProperties?: Property[]
	initialSearchQuery?: string
	title?: string
	showFilters?: boolean
}

export function PropertyListing({
	initialProperties = [],
	initialSearchQuery = "",
	title,
	showFilters = true,
}: PropertyListingProps) {
	const { properties, filters, updateFilters, updateSort, sortBy } = usePropertyManager(
		initialProperties,
		initialSearchQuery,
	)

	return (
		<div className="space-y-6">
			{title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}

			{showFilters && (
				<div className="mb-8">
					<PropertyFilters
						filters={filters}
						onChange={updateFilters}
						sort={sortBy}
						onSortChange={updateSort}
					/>
				</div>
			)}

			<PropertiesGrid properties={properties} />
		</div>
	)
}
