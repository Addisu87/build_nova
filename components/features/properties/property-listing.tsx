"use client"

import { useAuth } from "@/contexts/auth-context"
import { useProperties } from "@/hooks/properties/use-properties"
import { useState } from "react"
import { PropertyFilters } from "./property-filters"
import { PropertiesGrid } from "./property-grid"
import { PropertyMap } from "./property-map"
import { ViewToggle } from "./view-toggle"

interface PropertyListingProps {
	title?: string
	initialProperties?: Database["public"]["Tables"]["properties"]["Row"][]
	filters?: PropertyFilters
	viewType?: "grid" | "map"
	showFilters?: boolean
}

export function PropertyListing({
	title,
	initialProperties = [],
	filters,
	viewType = "grid",
	showFilters = true,
}: PropertyListingProps) {
	const [currentView, setCurrentView] = useState<"grid" | "map">(viewType)
	const { data: properties, isLoading } = useProperties(filters)
	const { isFavorite, toggleFavorite } = useAuth()

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				{title && <h2 className="text-2xl font-bold">{title}</h2>}

				<div className="flex items-center gap-4">
					{showFilters && <PropertyFilters />}
					<ViewToggle view={currentView} onChange={setCurrentView} />
				</div>
			</div>

			{isLoading ? (
				<PropertyGridSkeleton />
			) : currentView === "grid" ? (
				<PropertiesGrid
					properties={properties || initialProperties}
					onFavoriteToggle={toggleFavorite}
					isFavorite={isFavorite}
				/>
			) : (
				<PropertyMap
					properties={properties || initialProperties}
					onFavoriteToggle={toggleFavorite}
					isFavorite={isFavorite}
				/>
			)}
		</div>
	)
}
