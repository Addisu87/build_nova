"use client"

import { LoadingState } from "@/components/ui/loading-state"
import { useAuth } from "@/contexts/auth-context"
import { usePropertyManager } from "@/hooks/properties/use-property-manager"
import type { PropertyFilters as PropertyFiltersType } from "@/types"
import { useCallback, useState } from "react"
import { toast } from "sonner"
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

	const {
		properties,
		isLoading,
		isError,
		filters,
		updateFilters,
		createProperty,
		updateProperty,
		deleteProperty,
	} = usePropertyManager({
		...initialFilters,
		limit: pageSize,
		page: 1,
	})

	const handleFilterChange = useCallback(
		(newFilters: Partial<PropertyFiltersType>) => {
			updateFilters(newFilters)
		},
		[updateFilters],
	)

	const handleFavoriteToggle = useCallback(
		async (propertyId: string, isFavorited: boolean) => {
			if (!user) {
				toast.error("Please login to favorite properties")
				return
			}

			try {
				await updateProperty({
					id: propertyId,
					updates: {
						favorites: isFavorited ? { append: user.id } : { remove: user.id },
					},
				})
			} catch (error) {
				toast.error("Failed to update favorite status")
			}
		},
		[user, updateProperty],
	)

	const handleDelete = useCallback(
		async (propertyId: string) => {
			if (!user?.role === "admin") {
				toast.error("Unauthorized action")
				return
			}

			try {
				await deleteProperty(propertyId)
				toast.success("Property deleted successfully")
			} catch (error) {
				toast.error("Failed to delete property")
			}
		},
		[user, deleteProperty],
	)

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center p-8 space-y-4">
				<p className="text-red-500 font-medium">Failed to load properties</p>
				<button 
					onClick={() => window.location.reload()}
					className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
				>
					Try Again
				</button>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				{title && <h2 className="text-2xl font-bold">{title}</h2>}

				<div className="flex items-center gap-4">
					{showFilters && (
						<PropertyFilters
							onFiltersChange={handleFilterChange}
							initialFilters={filters}
						/>
					)}
					<ViewToggle 
						view={currentView} 
						onChange={setCurrentView} 
					/>
				</div>
			</div>

			{isLoading ? (
				<LoadingState type="properties" />
			) : currentView === "grid" ? (
				<PropertiesGrid
					properties={properties || []}
					onFavoriteToggle={handleFavoriteToggle}
					onDelete={handleDelete}
					isAdmin={user?.role === "admin"}
				/>
			) : (
				<PropertyMap
					properties={properties || []}
					onFavoriteToggle={handleFavoriteToggle}
					onDelete={handleDelete}
					isAdmin={user?.role === "admin"}
				/>
			)}
		</div>
	)
}
