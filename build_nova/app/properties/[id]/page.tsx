"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import {
	PropertyDetailsModal,
	PropertyMap,
	PropertyImageCarousel,
} from "@/features/properties"
import { Property } from "@/features/properties/types"
import { mockProperties } from "@/features/properties/mock-data"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { usePropertyFavorites } from "@/hooks/favorites/use-property-favorites"
import { Heart } from "lucide-react"

interface PropertyDetailsPageProps {
	params: {
		id: string
	}
}

export default function PropertyDetailsPage({
	params,
}: PropertyDetailsPageProps) {
	const [property, setProperty] =
		useState<Property | null>(null)
	const [isLoading, setIsLoading] = useState(true)
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
			} finally {
				setIsLoading(false)
			}
		}

		fetchProperty()
	}, [params.id])

	if (isLoading) {
		return (
			<main className="container mx-auto px-4 py-8">
				<div className="space-y-8">
					<Skeleton className="h-[400px] w-full" />
					<div className="grid gap-8 md:grid-cols-3">
						<div className="md:col-span-2 space-y-8">
							<Skeleton className="h-8 w-3/4" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-2/3" />
						</div>
						<div className="space-y-4">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-32 w-full" />
						</div>
					</div>
				</div>
			</main>
		)
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
		<main className="container mx-auto px-4 py-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="space-y-8"
			>
				<PropertyImageCarousel
					images={property.images}
					title={property.title}
				/>

				<div className="grid gap-8 md:grid-cols-3">
					<div className="md:col-span-2 space-y-8">
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-bold">
								{property.title}
							</h1>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full"
								onClick={() =>
									isFavorite(property.id)
										? removeFavorite(property.id)
										: addFavorite(property.id)
								}
							>
								<Heart
									className={`h-6 w-6 ${
										isFavorite(property.id)
											? "fill-red-500 text-red-500"
											: "text-gray-600"
									}`}
								/>
							</Button>
						</div>

						<p className="text-2xl font-bold text-blue-600">
							${property.price.toLocaleString()}
						</p>

						<div className="flex items-center gap-6 text-gray-600">
							<span>
								{property.bedrooms} beds
							</span>
							<span>
								{property.bathrooms} baths
							</span>
							<span>
								{property.square_feet.toLocaleString()}{" "}
								sqft
							</span>
						</div>

						<div>
							<h2 className="mb-4 text-xl font-semibold">
								Description
							</h2>
							<p className="text-gray-600">
								{property.description}
							</p>
						</div>

						<div>
							<h2 className="mb-4 text-xl font-semibold">
								Features
							</h2>
							<ul className="grid gap-2 sm:grid-cols-2">
								{property.features.map(
									(feature, index) => (
										<li
											key={index}
											className="flex items-center gap-2"
										>
											<span className="text-blue-600">
												•
											</span>
											{feature}
										</li>
									),
								)}
							</ul>
						</div>
					</div>

					<div className="space-y-4">
						<div className="rounded-lg border p-6">
							<h2 className="mb-4 text-xl font-semibold">
								Location
							</h2>
							<p className="text-gray-600">
								{property.address}
								<br />
								{property.city}, {property.state}{" "}
								{property.zip_code}
							</p>
						</div>

						<div className="h-[300px] rounded-lg border">
							<PropertyMap
								properties={[property]}
								center={[
									property.latitude,
									property.longitude,
								]}
								zoom={15}
							/>
						</div>
					</div>
				</div>
			</motion.div>
		</main>
	)
}
