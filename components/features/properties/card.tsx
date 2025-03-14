"use client"

import { ImageCarousel } from "@/components/ui/image-carousel"
import { Property } from "@/types/properties"
import Link from "next/link"

interface PropertyCardProps {
	property: Property
}

export function PropertyCard({
	property,
}: PropertyCardProps) {
	const images = property.images || [
		property.imageUrl,
	]

	return (
		<Link href={`/properties/${property.id}`}>
			<div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
				<ImageCarousel
					images={images}
					title={property.title}
					aspectRatio="property"
					className="h-[300px]"
					priority
				/>

				{/* Property Information */}
				<div className="p-4">
					<div className="flex items-start justify-between">
						<div>
							<h3 className="font-semibold">
								{property.title}
							</h3>
							<p className="text-sm text-gray-600">
								{property.location.address}
							</p>
						</div>
						<p className="font-semibold">
							${property.price.toLocaleString()}
						</p>
					</div>
					<div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
						<span>{property.bedrooms} beds</span>
						<span>•</span>
						<span>
							{property.bathrooms} baths
						</span>
						<span>•</span>
						<span>
							{property.area.toLocaleString()}{" "}
							sqft
						</span>
					</div>
				</div>
			</div>
		</Link>
	)
}
