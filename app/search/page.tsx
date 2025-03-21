"use client"

import { PropertyMap } from "@/components/features/properties/property-map"
import { PropertyCard } from "@/components/features/properties/property-card"
import { usePropertyManager } from "@/hooks/properties/use-property-manager"
import { useSearchParams } from "next/navigation"
import { PropertyFilters } from "@/components/features/properties/property-filters"

export default function SearchPage() {
	const searchParams = useSearchParams()
	const listingType = searchParams.get("type") || "buy"
	const { properties, updateFilters } = usePropertyManager({
		listingType: listingType as "buy" | "rent"
	})

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="sticky top-0 z-10 bg-white border-b shadow-sm">
				<div className="max-w-[1600px] mx-auto px-4 py-4">
					<PropertyFilters 
						onFiltersChange={updateFilters}
						initialFilters={{ listingType: listingType as "buy" | "rent" }}
					/>
				</div>
			</div>

			<div className="max-w-[1600px] mx-auto px-4 py-6">
				<div className="flex gap-6">
					<div className="w-[45%] sticky top-24 h-[calc(100vh-6rem)]">
						<div className="bg-white rounded-xl shadow-sm overflow-hidden">
							<PropertyMap
								properties={properties}
								zoom={12}
								height="h-full"
								onMarkerClick={(propertyId) => {
									window.location.href = `/properties/${propertyId}`
								}}
							/>
						</div>
					</div>

					<div className="w-[55%]">
						<div className="grid grid-cols-1 gap-6">
							{properties?.map((property) => (
								<PropertyCard key={property.id} property={property} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
