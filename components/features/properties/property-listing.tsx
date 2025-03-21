"use client"

import { mockProperties } from "@/mock-data/properties"
import { useState, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { PropertyFiltersType } from "@/types"
import { PropertiesGrid } from "./property-grid"
import { PropertyMap } from "./property-map"
import { ViewToggle } from "./view-toggle"
import { PropertyFilters } from "./property-filters"

interface PropertyListingProps {
	title?: string
	initialFilters?: PropertyFiltersType
	viewType?: "grid" | "map"
	showFilters?: boolean
	pageSize?: number
}

export function PropertyListing({
	title,
	initialFilters = {},
	viewType = "grid",
	showFilters = true,
	pageSize = 12,
}: PropertyListingProps) {
	const [currentView, setCurrentView] = useState<"grid" | "map">(viewType)
	const { user } = useAuth()
	const [properties] = useState(mockProperties)

	const handleFilterChange = useCallback(
		(newFilters: Partial<PropertyFiltersType>) => {
			// Implement filtering logic here if needed
			console.log('Filters changed:', newFilters)
		},
		[],
	)

	return (
		<div className="space-y-8">
			{title && (
				<h2 className="text-2xl font-bold">{title}</h2>
			)}

			{showFilters && (
				<div className="flex justify-between items-center">
					<PropertyFilters
						onFiltersChange={handleFilterChange}
						initialFilters={initialFilters}
					/>
					<ViewToggle 
						view={currentView} 
						onChange={setCurrentView} 
					/>
				</div>
			)}

			<div>
				{currentView === "grid" ? (
					<PropertiesGrid properties={properties} />
				) : (
					<PropertyMap properties={properties} />
				)}
			</div>
		</div>
	)
}
