"use client"

import { PropertyCard } from "@/components/features/properties/property-card"
import { PropertyFilters } from "@/components/features/properties/property-filters"
import { PropertyMap } from "@/components/features/properties/property-map"
import { PropertiesGrid } from "@/components/features/properties/property-grid"
import { usePropertyManager } from "@/hooks/properties/use-property-manager"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function BrowseAllHomesPage() {
	const searchParams = useSearchParams()
	const { properties, updateFilters } = usePropertyManager({
		listingType: "buy",
	})

	return (
		<div className="min-h-screen bg-background">
			{/* Top Bar with Quick Filters */}
			<div className="sticky top-0 z-20 bg-white border-b shadow-sm">
				<div className="flex items-center justify-between px-4 h-14">
					{/* Mobile Filters Button */}
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline" size="sm" className="lg:hidden">
								<SlidersHorizontal className="h-4 w-4 mr-2" />
								Filters
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-full sm:w-[540px] p-0">
							<PropertyFilters 
								onFiltersChange={updateFilters}
								initialFilters={{ listingType: "buy" }}
								className="p-6"
							/>
						</SheetContent>
					</Sheet>

					{/* Desktop Quick Filters */}
					<div className="hidden lg:flex items-center space-x-2 flex-1 justify-center">
						<PropertyFilters 
							onFiltersChange={updateFilters}
							initialFilters={{ listingType: "buy" }}
							variant="minimal"
						/>
					</div>
				</div>
			</div>

			{/* Split View Content */}
			<div className="flex h-[calc(100vh-3.5rem)]">
				{/* Properties Grid Section */}
				<div className="w-[55%] overflow-y-auto">
					<div className="p-6">
						{/* Results Count */}
						<div className="mb-6">
							<h1 className="text-2xl font-semibold">
								{properties?.length || 0} homes for sale
							</h1>
							<p className="text-sm text-muted-foreground">
								in selected area
							</p>
						</div>

						{/* Properties Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{properties?.map((property) => (
								<PropertyCard
									key={property.id}
									property={property}
								/>
							))}
						</div>
					</div>
				</div>

				{/* Map Section */}
				<div className="w-[45%] sticky top-14 h-[calc(100vh-3.5rem)]">
					<PropertyMap
						properties={properties || []}
						zoom={12}
						height="h-full"
						onMarkerClick={(propertyId) => {
							window.location.href = `/properties/${propertyId}`
						}}
						showInfoWindow
						clustered
					/>
				</div>
			</div>
		</div>
	)
}
