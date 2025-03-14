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
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const images = property.images || [property.imageUrl]

	const handlePrevious = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
	}

	const handleNext = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
	}

	return (
		<Link href={`/properties/${property.id}`}>
			<div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
				<div className="relative aspect-[4/3]">
					{/* Image Carousel */}
					<div className="relative h-full w-full">
						{images.map((image, index) => (
							<div
								key={index}
								className={cn(
									"absolute h-full w-full transition-opacity duration-300",
									index === currentImageIndex ? "opacity-100" : "opacity-0"
								)}
							>
								<Image
									src={image}
									alt={`${property.title} - Image ${index + 1}`}
									fill
									className="object-cover"
									priority={index === 0}
								/>
							</div>
						))}

						{/* Navigation Buttons - Only show if there are multiple images */}
						{images.length > 1 && (
							<>
								{/* Previous Button */}
								<button
									className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 opacity-0 shadow-md transition-opacity duration-200 hover:bg-white group-hover:opacity-100"
									onClick={handlePrevious}
								>
									<ChevronLeft className="h-4 w-4" />
								</button>

								{/* Next Button */}
								<button
									className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 opacity-0 shadow-md transition-opacity duration-200 hover:bg-white group-hover:opacity-100"
									onClick={handleNext}
								>
									<ChevronRight className="h-4 w-4" />
								</button>

								{/* Dots Indicator */}
								<div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
									{images.map((_, index) => (
										<div
											key={index}
											className={cn(
												"h-1.5 w-1.5 rounded-full bg-white transition-all",
												index === currentImageIndex ? "opacity-100" : "opacity-50"
											)}
										/>
									))}
								</div>
							</>
						)}

						{/* Favorite Button */}
						{onFavorite && (
							<button
								className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-md transition-transform hover:scale-110"
								onClick={(e) => {
									e.preventDefault()
									e.stopPropagation()
									onFavorite(property.id)
								}}
							>
								<Heart
									className={cn(
										"h-4 w-4",
										isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
									)}
								/>
							</button>
						)}
					</div>
				</div>

				{/* Property Information */}
				<div className="p-4">
					<div className="flex items-start justify-between">
						<div>
							<h3 className="font-semibold">{property.title}</h3>
							<p className="text-sm text-gray-600">{property.location.address}</p>
						</div>
						<p className="font-semibold">${property.price.toLocaleString()}</p>
					</div>
					<div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
						<span>{property.bedrooms} beds</span>
						<span>•</span>
						<span>{property.bathrooms} baths</span>
						<span>•</span>
						<span>{property.area.toLocaleString()} sqft</span>
					</div>
				</div>
			</div>
		</Link>
	)
}
