"use client"

import { PropertyMap } from "@/components/features/properties/property-map"
import { PropertiesGrid } from "@/components/features/properties/properties-grid"
import { usePropertyManager } from "@/hooks/properties/use-property-manager"
import { Property } from "@/types"
import { useEffect, useState } from "react"

export default function PropertiesPage({ params }: { params: { category: string } }) {
	const { properties } = usePropertyManager()
	const [filteredProperties, setFilteredProperties] = useState<Property[]>([])

	useEffect(() => {
		if (properties) {
			// Filter properties based on category (buy, rent, etc.)
			const filtered = properties.filter((property) => {
				switch (params.category) {
					case "buy":
						return property.status === "for-sale"
					case "rent":
						return property.status === "for-rent"
					case "nearby":
						// Add logic for nearby properties based on user's location
						return true
					default:
						return true
				}
			})
			setFilteredProperties(filtered)
		}
	}, [properties, params.category])

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-6">
				<div className="flex gap-6">
					{/* Map Section */}
					<div className="w-[45%] sticky top-24 h-[calc(100vh-6rem)]">
						<div className="bg-white rounded-xl shadow-sm overflow-hidden">
							<PropertyMap
								properties={filteredProperties}
								zoom={12}
								height="h-full"
								onMarkerClick={(propertyId) => {
									window.location.href = `/properties/${propertyId}`
								}}
							/>
						</div>
					</div>

					{/* Properties Grid Section */}
					<div className="w-[55%]">
						<PropertiesGrid properties={filteredProperties} />
					</div>
				</div>
			</div>
		</div>
	)
}
