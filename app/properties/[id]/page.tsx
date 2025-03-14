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
	DollarSign,
	Clock,
	Calendar,
} from "lucide-react"

interface PropertyDetailsPageProps {
	params: {
		id: string
	}
}

export default function PropertyDetailsPage({
	params,
}: PropertyDetailsPageProps) {
	const [property, setProperty] = useState<Property | null>(null)
	const { isLoading: authLoading } = useAuth()
	const {
		addFavorite,
		removeFavorite,
		isFavorite,
	} = usePropertyFavorites()

	useEffect(() => {
		// Simulating API call to fetch property details
		const fetchProperty = async () => {
			try {
				// In a real app, this would be an API call
				const found = mockProperties.find(
					(p) => p.id === params.id,
				)
				if (!found) {
					notFound()
				}
				setProperty(found)
			} catch (error) {
				console.error(
					"Error fetching property:",
					error,
				)
				notFound()
			}
		}

		fetchProperty()
	}, [params.id])

	if (authLoading) {
		return <PropertyDetailsLoading />
	}

	if (!property) {
		return (
			<main className="container mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold">
					Property not found
				</h1>
			</main>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section with Images */}
			<section className="relative">
				<PropertyImageCarousel
					images={property.images || [property.imageUrl]}
					title={property.title}
					fullWidth
				/>
			</section>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Basic Info */}
						<div className="bg-white rounded-lg shadow-lg p-6">
							<h1 className="text-3xl font-bold mb-2">
								{property.title}
							</h1>
							<p className="text-xl text-gray-600 mb-4">
								{property.location}
							</p>
							<div className="flex items-center gap-4 text-lg">
								<span className="font-bold text-2xl text-blue-600">
									${property.price.toLocaleString()}
								</span>
								<div className="flex items-center gap-6 text-gray-600">
									<span>{property.bedrooms} beds</span>
									<span>{property.bathrooms} baths</span>
									<span>
										{property.square_feet?.toLocaleString() ?? "N/A"}{" "}
										sqft
									</span>
								</div>
							</div>
						</div>

						{/* Property Details */}
						<div className="bg-white rounded-lg shadow-lg p-6">
							<h2 className="text-2xl font-semibold mb-6">
								Property Details
							</h2>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-6">
								<DetailItem
									icon={Home}
									label="Type"
									value={property.propertyType}
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
									value={`${
										property.lotSize ?? "N/A"
									} sqft`}
								/>
								<DetailItem
									icon={Car}
									label="Garage"
									value={`${
										property.garage ?? 0
									} spaces`}
								/>
								<DetailItem
									icon={Building2}
									label="Stories"
									value={
										property.stories?.toString() ??
										"N/A"
									}
								/>
								<DetailItem
									icon={Trees}
									label="Lot"
									value={
										property.lotSize
											? `${(
													property.lotSize / 43560
											  ).toFixed(2)} acres`
											: "N/A"
									}
								/>
							</div>
						</div>

						{/* Description */}
						<div className="bg-white rounded-lg shadow-lg p-6">
							<h2 className="text-2xl font-semibold mb-4">
								About This Property
							</h2>
							<p className="text-gray-600 whitespace-pre-line">
								{property.description}
							</p>
						</div>

						{/* Features & Amenities */}
						<div className="bg-white rounded-lg shadow-lg p-6">
							<h2 className="text-2xl font-semibold mb-6">
								Features & Amenities
							</h2>
							<div className="grid grid-cols-2 gap-4">
								{property.amenities?.map(
									(amenity, index) => (
										<div
											key={index}
											className="flex items-center gap-2"
										>
											<span className="text-blue-600">
												•
											</span>
											{amenity}
										</div>
									),
								)}
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-8">
						{/* Map */}
						<div className="bg-white rounded-lg shadow-lg p-6">
							<h2 className="text-xl font-semibold mb-4">
								Location
							</h2>
							<div className="h-[300px] rounded-lg overflow-hidden">
								<PropertyMap
									property={property}
									isLoading={false}
								/>
							</div>
							<p className="mt-4 text-gray-600">
								{property.location}
							</p>
						</div>

						{/* Property History */}
						<div className="bg-white rounded-lg shadow-lg p-6">
							<h2 className="text-xl font-semibold mb-4">
								Property History
							</h2>
							<div className="space-y-4">
								<HistoryItem
									icon={DollarSign}
									date="Mar 2024"
									label="Listed for sale"
									value={`$${property.price.toLocaleString()}`}
								/>
								{property.priceHistory?.map(
									(history, index) => (
										<HistoryItem
											key={index}
											icon={Clock}
											date={new Date(
												history.date,
											).toLocaleDateString(
												"en-US",
												{
													month: "short",
													year: "numeric",
												},
											)}
											label={history.type}
											value={`$${history.price.toLocaleString()}`}
										/>
									),
								)}
							</div>
						</div>
					</div>
				</div>
			</main>
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

interface HistoryItemProps {
	icon: any
	date: string
	label: string
	value: string
}

function HistoryItem({
	icon: Icon,
	date,
	label,
	value,
}: HistoryItemProps) {
	return (
		<div className="flex items-center gap-3">
			<Icon className="h-5 w-5 text-blue-600" />
			<div className="flex-1">
				<p className="text-sm text-gray-500">
					{date}
				</p>
				<p className="font-medium">{label}</p>
			</div>
			<p className="font-semibold">{value}</p>
		</div>
	)
}
