"use client"

import { Property } from "./types"
import { Button } from "@/components/ui"
import { PropertyImageCarousel } from "./image-carousel"
import { Heart } from "lucide-react"
import Link from "next/link"

interface PropertyCardProps {
	property: Property
	onFavorite?: (propertyId: string) => void
	isFavorite?: boolean
}

export function PropertyCard({
	property,
	onFavorite,
	isFavorite = false,
}: PropertyCardProps) {
	return (
		<div className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
			<div className="relative">
				<PropertyImageCarousel
					images={property.images}
					title={property.title}
				/>
				{onFavorite && (
					<button
						onClick={() =>
							onFavorite(property.id)
						}
						className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-100"
					>
						<Heart
							className={`h-4 w-4 ${
								isFavorite
									? "fill-red-500 text-red-500"
									: "text-gray-500"
							}`}
						/>
					</button>
				)}
			</div>
			<div className="p-4">
				<Link href={`/properties/${property.id}`}>
					<h3 className="text-lg font-semibold">
						{property.title}
					</h3>
				</Link>
				<p className="mt-2 text-2xl font-bold text-primary">
					${property.price.toLocaleString()}
				</p>
				<div className="mt-4 flex justify-between text-sm text-gray-500">
					<span>{property.bedrooms} beds</span>
					<span>{property.bathrooms} baths</span>
					<span>
						{property.area.toLocaleString()} sqft
					</span>
				</div>
				<p className="mt-2 text-sm text-gray-600">
					{property.location}
				</p>
			</div>
		</div>
	)
}
