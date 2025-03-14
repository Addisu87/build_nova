"use client"

import { ImageCarousel } from "@/components/ui/image-carousel"
import { ImageThumbnails } from "@/components/ui/image-thumbnails"
import { PropertyMap } from "@/components/features/properties"
import { mockProperties } from "@/components/features/properties/mock-data"
import { Property } from "@/components/features/properties/types"
import {
	Building2,
	Calendar,
	Car,
	Home,
	Ruler,
	Trees,
} from "lucide-react"
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
	const [currentImageIndex, setCurrentImageIndex] = useState(0)

	// Fetch the main property
	useEffect(() => {
		const found = mockProperties.find(
			(p) => p.id === params.id,
		)
		if (!found) {
			notFound()
		}
		setProperty(found)

		// Find nearby properties (excluding the current property)
		// In a real application, you would want to use geospatial queries
		const nearby = mockProperties
			.filter(
				(p) =>
					p.id !== params.id &&
					isNearby(found.location, p.location),
			)
			.slice(0, 10) // Limit to 10 nearby properties
		setNearbyProperties(nearby)
	}, [params.id])

	if (!property) {
		return <PropertyDetailsLoading />
	}

	return (
		<div className="relative min-h-screen bg-gray-50">
			{/* Main image carousel */}
			<div className="relative w-full">
				<ImageCarousel
					images={property.images}
					title={property.title}
					aspectRatio="property"
					fullWidth
					priority
					className="h-[500px] lg:h-[600px]"
					currentIndex={currentImageIndex}
					onIndexChange={setCurrentImageIndex}
				/>
			</div>

			{/* Thumbnails below the carousel */}
			<div className="max-w-[1600px] mx-auto px-4 -mt-20 relative z-10">
				<ImageThumbnails
					images={property.images}
					currentIndex={currentImageIndex}
					onSelect={setCurrentImageIndex}
					title={property.title}
					className="bg-white p-4 rounded-lg shadow-lg"
				/>
			</div>

			{/* Main content */}
			<div className="relative lg:flex max-w-[1600px] mx-auto mt-8">
				{/* Left side - Scrollable content */}
				<div className="w-full lg:w-[45%] lg:overflow-y-auto">
					{/* Content below carousel */}
					<div className="px-4 py-8">
						{/* Basic Info */}
						<div className="mb-8">
							<h1 className="text-3xl font-bold mb-2">
								{property.title}
							</h1>
							<p className="text-xl text-gray-600 mb-4">
								{property.location.address}
							</p>
							<div className="flex items-center gap-4 text-lg">
								<span className="font-bold text-2xl text-blue-600">
									{(
										property.price || 0
									).toLocaleString()}
								</span>
								<div className="flex items-center gap-6 text-gray-600">
									<span>
										{property.bedrooms} beds
									</span>
									<span>
										{property.bathrooms} baths
									</span>
									<span>
										{(
											property.area || 0
										).toLocaleString()}{" "}
										sqft
									</span>
								</div>
							</div>
						</div>

						{/* Property Details */}
						<div className="bg-white rounded-lg shadow-sm p-6 mb-8">
							<h2 className="text-2xl font-semibold mb-6">
								Property Details
							</h2>
							<div className="grid grid-cols-2 gap-6">
								<DetailItem
									icon={Home}
									label="Type"
									value={
										property.propertyType || "N/A"
									}
								/>
								<DetailItem
									icon={Calendar}
									label="Year Built"
									value={
										property.yearBuilt?.toString() ??
										"N/A"
									}
								/>
								<DetailItem
									icon={Ruler}
									label="Lot Size"
									value={`${(
										property.lotSize || 0
									).toLocaleString()} sqft`}
								/>
								<DetailItem
									icon={Car}
									label="Garage"
									value={`${
										property.garage || 0
									} cars`}
								/>
								<DetailItem
									icon={Building2}
									label="Stories"
									value={(
										property.stories || 0
									).toString()}
								/>
								<DetailItem
									icon={Trees}
									label="Outdoor Space"
									value={
										property.outdoorSpace || "N/A"
									}
								/>
							</div>
						</div>

						{/* Description */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-2xl font-semibold mb-4">
								Description
							</h2>
							<p className="text-gray-600 whitespace-pre-line">
								{property.description}
							</p>
						</div>
					</div>
				</div>

				{/* Right side - Fixed Map */}
				<div className="hidden lg:block lg:w-[55%] h-screen sticky top-0 pt-8 pl-4 pr-4">
					<div className="h-[600px] bg-white rounded-lg shadow-sm overflow-hidden">
						<PropertyMap
							property={property}
							nearbyProperties={nearbyProperties}
							height="h-full"
							isSelected={true}
							onMarkerClick={(propertyId) => {
								if (propertyId !== property.id) {
									window.location.href = `/properties/${propertyId}`
								}
							}}
						/>
					</div>
					<div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
						<h3 className="text-lg font-semibold mb-3">
							Nearby Properties
						</h3>
						<div className="space-y-2">
							{nearbyProperties.map((prop) => (
								<div
									key={prop.id}
									className="flex items-center justify-between py-2 hover:bg-gray-50 cursor-pointer"
									onClick={() =>
										(window.location.href = `/properties/${prop.id}`)
									}
								>
									<div className="flex items-center gap-3">
										<img
											src={prop.imageUrl}
											alt={prop.title}
											className="w-12 h-12 object-cover rounded"
										/>
										<div>
											<p className="font-medium">
												$
												{prop.price.toLocaleString()}
											</p>
											<p className="text-sm text-gray-600">
												{prop.bedrooms} beds •{" "}
												{prop.bathrooms} baths
											</p>
										</div>
									</div>
									<div className="text-blue-600 text-sm">
										View
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Mobile Map Button - Shows at bottom of screen on mobile */}
				<div className="lg:hidden fixed bottom-4 right-4">
					<button
						onClick={() => {
							/* Add mobile map toggle logic */
						}}
						className="bg-white p-3 rounded-full shadow-lg"
					>
						<Map className="h-6 w-6 text-gray-700" />
					</button>
				</div>
			</div>
		</div>
	)
}

interface DetailItemProps {
	icon: any
	label: string
	value: string
}

function DetailItem({
	icon: Icon,
	label,
	value,
}: DetailItemProps) {
	return (
		<div className="flex items-center gap-3">
			<Icon className="h-5 w-5 text-blue-600" />
			<div>
				<p className="text-sm text-gray-500">
					{label}
				</p>
				<p className="font-medium">{value}</p>
			</div>
		</div>
	)
}

// Helper function to determine if a property is nearby
// In a real application, you would want to use proper geospatial calculations
function isNearby(
	location1: any,
	location2: any,
) {
	// This is a simplified example - you should implement proper distance calculation
	// using latitude and longitude
	return true // For demo purposes, considering all properties as nearby
}
