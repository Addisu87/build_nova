"use client"

import { ClimateRisks } from "@/components/features/properties/climate-risks"
import { GettingAround } from "@/components/features/properties/getting-around"
import { MarketValue } from "@/components/features/properties/market-value"
import { MonthlyPayment } from "@/components/features/properties/monthly-payment"
import { NearbyProperties } from "@/components/features/properties/nearby-properties"
import { PropertyBasicInfo } from "@/components/features/properties/property-basic-info"
import { PropertyDescription } from "@/components/features/properties/property-description"
import { PropertyFacts } from "@/components/features/properties/property-facts"
import { PropertyMap } from "@/components/features/properties/property-map"
import { PropertySpecifications } from "@/components/features/properties/property-specifications"
import { Property } from "@/components/features/properties/types"
import { ImageThumbnails } from "@/components/ui/image-thumbnails"
import { mockProperties } from "@/mock-data/properties"
import { ImageIcon } from "lucide-react"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import PropertyDetailsLoading from "./loading"
import { PropertyDetailsModal } from "@/components/features/properties/details-modal"

export default function PropertyDetailsPage({
	params,
}: {
	params: { id: string }
}) {
	const [property, setProperty] =
		useState<Property | null>(null)
	const [nearbyProperties, setNearbyProperties] =
		useState<Property[]>([])
	const [
		currentImageIndex,
		setCurrentImageIndex,
	] = useState(0)
	const [isGalleryOpen, setIsGalleryOpen] =
		useState(false)

	useEffect(() => {
		const found = mockProperties.find(
			(p) => p.id === params.id,
		)
		if (!found) {
			notFound()
		}
		setProperty(found)

		const nearby = mockProperties
			.filter(
				(p) =>
					p.id !== params.id &&
					isNearby(found.location, p.location),
			)
			.slice(0, 10)
		setNearbyProperties(nearby)
	}, [params.id])

	if (!property) {
		return <PropertyDetailsLoading />
	}

	return (
		<div className="relative min-h-screen bg-gray-50">
			{/* Full-width image section */}
			<div className="relative w-full bg-gray-50">
				<div className="max-w-[1600px] mx-auto">
					<div className="relative">
						<ImageThumbnails
							images={property.images}
							currentIndex={currentImageIndex}
							onSelect={setCurrentImageIndex}
							title={property.title}
							className="w-full"
						/>

						<button
							onClick={() =>
								setIsGalleryOpen(true)
							}
							className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-6 py-3 
								rounded-lg shadow-md text-sm font-medium hover:bg-white 
								transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
								flex items-center gap-2 z-10"
						>
							<span>View all photos</span>
							<ImageIcon className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			{/* Content section */}
			<div className="max-w-[1600px] mx-auto px-4 lg:px-8">
				<div className="relative lg:flex gap-8 py-8">
					{/* Main content */}
					<div className="w-full lg:w-[65%] space-y-8">
						<div className="bg-white rounded-xl shadow-sm">
							<PropertyBasicInfo
								property={property}
							/>
						</div>

						<div className="bg-white rounded-xl shadow-sm">
							<PropertyDescription
								property={property}
							/>
						</div>

						<div className="bg-white rounded-xl shadow-sm">
							<PropertySpecifications
								property={property}
							/>
						</div>

						<div className="bg-white rounded-xl shadow-sm">
							<PropertyFacts
								property={property}
							/>
						</div>

						<div className="bg-white rounded-xl shadow-sm">
							<MarketValue property={property} />
						</div>

						<div className="bg-white rounded-xl shadow-sm">
							<MonthlyPayment
								property={property}
							/>
						</div>

						<div className="bg-white rounded-xl shadow-sm">
							<ClimateRisks />
						</div>

						<div className="bg-white rounded-xl shadow-sm">
							<GettingAround />
						</div>
					</div>

					{/* Sidebar */}
					<div className="hidden lg:block lg:w-[35%]">
						<div className="sticky top-8 space-y-8">
							<div className="bg-white rounded-xl shadow-sm overflow-hidden">
								<PropertyMap
									property={property}
									nearbyProperties={
										nearbyProperties
									}
									height="h-[400px]"
									isSelected={true}
									onMarkerClick={(propertyId) => {
										if (
											propertyId !== property.id
										) {
											window.location.href = `/properties/${propertyId}`
										}
									}}
								/>
							</div>

							<div className="bg-white rounded-xl shadow-sm">
								<NearbyProperties
									currentProperty={property}
									nearbyProperties={
										nearbyProperties
									}
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

// Helper function to determine if a property is nearby
function isNearby(
	location1: any,
	location2: any,
) {
	return true // For demo purposes, considering all properties as nearby
}
