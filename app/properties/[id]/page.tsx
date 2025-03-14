"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import {
	PropertyMap,
	PropertyImageCarousel,
} from "@/components/features/properties"
import { Property } from "@/components/features/properties/types"
import { mockProperties } from "@/components/features/properties/mock-data"
import { usePropertyFavorites } from "@/hooks/favorites/use-property-favorites"
import { useAuth } from "@/contexts/auth-context"
import PropertyDetailsLoading from "./loading"
import {
	Home,
	Ruler,
	Car,
	Building2,
	Trees,
	Map,
	Calendar,
} from "lucide-react"

export default function PropertyDetailsPage({
	params,
}: {
	params: { id: string }
}) {
	const [property, setProperty] = useState<Property | null>(null)
	
	useEffect(() => {
		const found = mockProperties.find((p) => p.id === params.id)
		if (!found) {
			notFound()
		}
		setProperty(found)
	}, [params.id])

	if (!property) {
		return <PropertyDetailsLoading />
	}

	return (
		<div className="relative min-h-screen bg-gray-50">
			{/* Full width image carousel */}
			<div className="w-full h-[400px] lg:h-[600px]">
				<PropertyImageCarousel
					images={property.images}
					title={property.title}
					fullWidth
				/>
			</div>

			{/* Main content */}
			<div className="relative lg:flex max-w-[1600px] mx-auto">
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
									{(property.price || 0).toLocaleString()}
								</span>
								<div className="flex items-center gap-6 text-gray-600">
									<span>{property.bedrooms} beds</span>
									<span>{property.bathrooms} baths</span>
									<span>{(property.area || 0).toLocaleString()} sqft</span>
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
									value={property.propertyType || 'N/A'}
								/>
								<DetailItem
									icon={Calendar}
									label="Year Built"
									value={property.yearBuilt?.toString() ?? "N/A"}
								/>
								<DetailItem
									icon={Ruler}
									label="Lot Size"
									value={`${(property.lotSize || 0).toLocaleString()} sqft`}
								/>
								<DetailItem
									icon={Car}
									label="Garage"
									value={`${property.garage || 0} cars`}
								/>
								<DetailItem
									icon={Building2}
									label="Stories"
									value={(property.stories || 0).toString()}
								/>
								<DetailItem
									icon={Trees}
									label="Outdoor Space"
									value={property.outdoorSpace || 'N/A'}
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
							height="h-full"
							isSelected={true}
							onMarkerClick={() => {}}
						/>
					</div>
				</div>

				{/* Mobile Map Button - Shows at bottom of screen on mobile */}
				<div className="lg:hidden fixed bottom-4 right-4">
					<button 
						onClick={() => {/* Add mobile map toggle logic */}}
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

function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
	return (
		<div className="flex items-center gap-3">
			<Icon className="h-5 w-5 text-blue-600" />
			<div>
				<p className="text-sm text-gray-500">{label}</p>
				<p className="font-medium">{value}</p>
			</div>
		</div>
	)
}


