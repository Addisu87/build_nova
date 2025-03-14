"use client"

import { Property } from "@/types/properties"
import { Button } from "@/components/ui"
import { Heart, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

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
	const images = property.images || [property.imageUrl]
	
	return (
		<div className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
			<div className="relative aspect-[4/3]">
				<div className="group relative h-full w-full">
					{images.length > 1 ? (
						// Grid layout for multiple images
						<div className="grid grid-cols-2 gap-0.5 h-full">
							<div className="relative row-span-2">
								<Image
									src={images[0]}
									alt={`${property.title} - Main Image`}
									fill
									className="object-cover"
								/>
							</div>
							<div className="relative">
								<Image
									src={images[1]}
									alt={`${property.title} - Image 2`}
									fill
									className="object-cover"
								/>
							</div>
							<div className="relative">
								<Image
									src={images[2] || images[1]} // Fallback to second image if third doesn't exist
									alt={`${property.title} - Image 3`}
									fill
									className="object-cover"
								/>
							</div>
						</div>
					) : (
						// Single image layout
						<Image
							src={images[0]}
							alt={property.title}
							fill
							className="object-cover"
						/>
					)}
					
					{onFavorite && (
						<button
							onClick={() => onFavorite(property.id)}
							className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-100 z-10"
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
					<span>{property.area.toLocaleString()} sqft</span>
				</div>
				<p className="mt-2 text-sm text-gray-600">
					{property.location.address}
				</p>
				<p className="mt-2 text-sm text-gray-600">
					{`${property.location.city}, ${property.location.state} ${property.location.zipCode}`}
				</p>
			</div>
		</div>
	)
}
