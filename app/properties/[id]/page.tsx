"use client"

import { ClimateRisks } from "@/components/features/properties/climate-risks"
import { PropertyDetailsModal } from "@/components/features/properties/details-modal"
import { GettingAround } from "@/components/features/properties/getting-around"
import { MarketValue } from "@/components/features/properties/market-value"
import { MonthlyPayment } from "@/components/features/properties/monthly-payment"
import { NearbyProperties } from "@/components/features/properties/nearby-properties"
import { PropertyBasicInfo } from "@/components/features/properties/property-basic-info"
import { PropertyDescription } from "@/components/features/properties/property-description"
import { PropertyFacts } from "@/components/features/properties/property-facts"
import { PropertyMap } from "@/components/features/properties/property-map"
import { PropertySpecifications } from "@/components/features/properties/property-specifications"

import { ImageThumbnails } from "@/components/ui/image-thumbnails"
import { LoadingState } from "@/components/ui/loading-state"
import { usePropertyManager } from "@/hooks/properties/use-property-manager"
import { mockProperties } from "@/mock-data/properties"
import { Property } from "@/types"
import { LayoutGrid } from "lucide-react"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
	const { properties, isLoading } = usePropertyManager()
	const [property, setProperty] = useState<Property | null>(null)
	const [nearbyProperties, setNearbyProperties] = useState<Property[]>([])
	const [isGalleryOpen, setIsGalleryOpen] = useState(false)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)

	useEffect(() => {
		if (isLoading || !properties) return

		const found =
			properties.find((p) => p.id === params.id) ||
			mockProperties.find((p) => p.id === params.id)

		if (!found) {
			notFound()
			return
		}

		setProperty(found)

		// Ensure property has an images array
		const propertyWithImages = {
			...found,
			images: found.images || [],
		}

		const nearby = (properties || mockProperties)
			.filter((p) => p.id !== params.id && isNearby(propertyWithImages, p))
			.slice(0, 10)
		setNearbyProperties(nearby)
	}, [params.id, properties, isLoading])

	// Render loading state
	if (isLoading || !property) {
		return (
			<main className="container mx-auto py-8">
				<LoadingState type="property" />
			</main>
		)
	}

	return (
		<div className="relative min-h-screen bg-gray-50 pt-4">
			{/* Full-width image section */}
			<div className="max-w-[1600px] mx-auto px-2 lg:px-4">
				<div className="max-w-[1600px] mx-auto">
					<div className="relative">
						<ImageThumbnails
							images={property.images || []}
							currentIndex={currentImageIndex}
							onSelect={setCurrentImageIndex}
							title={property.title}
							className="w-full"
						/>

						{property.images?.length > 0 && (
							<button
								onClick={() => setIsGalleryOpen(true)}
								className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-6 py-3 
									rounded-lg shadow-md text-sm font-medium hover:bg-white 
									transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
									flex items-center gap-2 z-10"
							>
								<span>Show all</span>
								<LayoutGrid className="w-4 h-4" />
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Content section */}
			<div className="max-w-[1600px] mx-auto px-2 lg:px-4">
				<div className="relative lg:flex gap-6 py-6">
					{/* Main content - reduced from 60% to 50% */}
					<div className="w-full lg:w-[50%] space-y-6">
						<div className="bg-white rounded-xl shadow-sm">
							<PropertyBasicInfo property={property} />
						</div>

						<div className="bg-white rounded-xl shadow-sm">
							<PropertyDescription property={property} />
						</div>

						<div className="bg-white rounded-xl shadow-sm">
							<PropertySpecifications property={property} />
						</div>

						<div className="bg-white rounded-xl shadow-sm">
							<PropertyFacts property={property} />
						</div>

						<div className="bg-white rounded-xl shadow-sm">
							<MarketValue property={property} />
						</div>

						<div className="bg-white rounded-xl shadow-sm">
							<MonthlyPayment property={property} />
						</div>

						<div className="bg-white rounded-xl shadow-sm">
							<ClimateRisks />
						</div>

						<div className="bg-white rounded-xl shadow-sm">
							<GettingAround />
						</div>
					</div>

					{/* Sidebar - increased from 40% to 50% */}
					<div className="hidden lg:block lg:w-[50%]">
						<div className="sticky top-8 space-y-8">
							<div className="bg-white rounded-xl shadow-sm overflow-hidden">
								<PropertyMap
									property={property}
									nearbyProperties={nearbyProperties}
									zoom={13}
									height="h-[500px]"
									isSelected={true}
									onMarkerClick={(propertyId) => {
										if (propertyId !== property.id) {
											window.location.href = `/properties/${propertyId}`
										}
									}}
								/>
							</div>

							<div className="bg-white rounded-xl shadow-sm">
								<NearbyProperties
									currentProperty={property}
									nearbyProperties={nearbyProperties}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Image Gallery Modal */}
			<PropertyDetailsModal
				property={property}
				isOpen={isGalleryOpen}
				onClose={() => setIsGalleryOpen(false)}
			/>
		</div>
	)
}

// Helper function to determine if a property is nearby based on coordinates
function isNearby(prop1: Property, prop2: Property): boolean {
	const MAX_DISTANCE = 10 // kilometers

	// Calculate distance using Haversine formula
	const R = 6371 // Earth's radius in kilometers
	const dLat = ((prop2.latitude - prop1.latitude) * Math.PI) / 180
	const dLon = ((prop2.longitude - prop1.longitude) * Math.PI) / 180
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((prop1.latitude * Math.PI) / 180) *
			Math.cos((prop2.latitude * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2)
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
	const distance = R * c

	return distance <= MAX_DISTANCE
}
