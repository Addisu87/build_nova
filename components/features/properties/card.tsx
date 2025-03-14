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
	const [currentIndex, setCurrentIndex] = useState(0)
	const images = property.images || [property.imageUrl]

	const handlePrevious = () => {
		setCurrentIndex((prev) =>
			prev === 0 ? images.length - 1 : prev - 1
		)
	}

	const handleNext = () => {
		setCurrentIndex((prev) =>
			prev === images.length - 1 ? 0 : prev + 1
		)
	}

	return (
		<div className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
			<div className="relative aspect-[4/3]">
				<div className="group relative h-full w-full">
					<Image
						src={images[currentIndex]}
						alt={`${property.title} - Image ${currentIndex + 1}`}
						fill
						className="object-cover"
					/>
					{images.length > 1 && (
						<>
							<Button
								variant="ghost"
								size="icon"
								className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
								onClick={handlePrevious}
							>
								<ChevronLeft className="h-4 w-4 text-white" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
								onClick={handleNext}
							>
								<ChevronRight className="h-4 w-4 text-white" />
							</Button>
							<div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
								{images.map((_, index) => (
									<button
										key={index}
										className={cn(
											"h-1.5 w-1.5 rounded-full bg-white/80 transition-all",
											index === currentIndex ? "w-3" : "opacity-50"
										)}
										onClick={() => setCurrentIndex(index)}
									/>
								))}
							</div>
						</>
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
					{property.location}
				</p>
			</div>
		</div>
	)
}
