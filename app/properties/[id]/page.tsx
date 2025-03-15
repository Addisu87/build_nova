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
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import PropertyDetailsLoading from "./loading"

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
			<div className="relative w-full bg-white">
				<div className="relative">
					<ImageThumbnails
						images={property.images}
						currentIndex={currentImageIndex}
						onSelect={setCurrentImageIndex}
						title={property.title}
					/>

					<button
						onClick={() => {
							/* Add your view all photos logic here */
						}}
						className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-6 py-3 
							rounded-lg shadow-md text-sm font-medium hover:bg-white 
							transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
							flex items-center gap-2"
					>
						<span>Show all photos</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-4 h-4"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
							/>
						</svg>
					</button>
				</div>
			</div>

			<div className="max-w-[1600px] mx-auto px-4 mt-8 pb-8">
				<div className="relative lg:flex max-w-[1600px] mx-auto mt-8 gap-8">
					<div className="w-full lg:w-[65%] space-y-8">
						<PropertyBasicInfo
							property={property}
						/>
						<PropertyDescription
							property={property}
						/>
						<PropertySpecifications
							property={property}
						/>
						<PropertyFacts property={property} />
						<MarketValue property={property} />
						<MonthlyPayment property={property} />
						<ClimateRisks />
						<GettingAround />
					</div>

					<div className="hidden lg:flex lg:w-[35%] flex-col">
						<div className="sticky top-4">
							<div className="h-[600px] bg-white rounded-lg shadow-sm overflow-hidden mb-4">
								<PropertyMap
									property={property}
									nearbyProperties={
										nearbyProperties
									}
									height="h-full"
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
							<div className="h-[calc(100vh-700px)]">
								<NearbyProperties
									currentProperty={property}
									nearbyProperties={
										nearbyProperties
									}
								/>
							</div>
						</div>
					</div>

					<div className="lg:hidden fixed bottom-4 right-4">
						<button
							onClick={() => {
								/* Add mobile map toggle logic */
							}}
							className="bg-white p-3 rounded-full shadow-lg"
						>
							<PropertyMap className="h-6 w-6 text-gray-700" />
						</button>
					</div>
				</div>
			</div>
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
