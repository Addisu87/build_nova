"use client"

import { PropertyMap } from "@/components/features/properties/property-map"
import { Property } from "@/components/features/properties/types"
import { ImageCarousel } from "@/components/ui/image-carousel"
import { ImageThumbnails } from "@/components/ui/image-thumbnails"
import { mockProperties } from "@/mock-data/properties"
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
import { NearbyProperties } from "@/components/features/properties/nearby-properties"

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
			{/* Main image carousel and thumbnails section */}
			<div className="relative w-full bg-white">
				<div className="relative">
					{/* Image thumbnails grid */}
					<ImageThumbnails
						images={property.images}
						currentIndex={currentImageIndex}
						onSelect={setCurrentImageIndex}
						title={property.title}
					/>
					
					{/* View all photos button */}
					<button
						onClick={() => {/* Add your view all photos logic here */}}
						className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-6 py-3 
							rounded-lg shadow-md text-sm font-medium hover:bg-white 
							transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
							flex items-center gap-2"
					>
						<span>Show all photos</span>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
							<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
						</svg>
					</button>
				</div>
			</div>

			{/* Property content */}
			<div className="max-w-[1600px] mx-auto px-4 mt-8 pb-8">
				{/* Main content */}
				<div className="relative lg:flex max-w-[1600px] mx-auto mt-8 gap-4">
					{/* Left side - Scrollable content */}
					<div className="w-full lg:w-[45%]">
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

					{/* Right side - Fixed Map and Nearby Properties */}
					<div className="hidden lg:flex lg:w-[55%] flex-col">
						{/* Map Container */}
						<div className="sticky top-4">
							<div className="h-[600px] bg-white rounded-lg shadow-sm overflow-hidden mb-4">
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
							{/* Nearby Properties */}
							<div className="h-[calc(100vh-700px)]"> {/* Adjusted height */}
								<NearbyProperties 
									currentProperty={property}
									nearbyProperties={nearbyProperties}
								/>
							</div>
						</div>
					</div>

					{/* Mobile Map Button */}
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

function calculateDistance(loc1: any, loc2: any) {
	// This is a simplified version - you might want to implement actual distance calculation
	// using the Haversine formula or similar
	return "0.5 mi away"
}
