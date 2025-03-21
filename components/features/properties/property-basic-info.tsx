"use client"

import { formatPrice } from "@/lib/utils"
import { Property } from "@/types"

interface PropertyBasicInfoProps {
	property: Property
}

export function PropertyBasicInfo({ property }: PropertyBasicInfoProps) {
	return (
		<section className="bg-white rounded-lg shadow-sm p-6">
			<h1 className="text-3xl font-bold mb-2">{property.title}</h1>
			<p className="text-xl text-gray-600 mb-4">{property.address}</p>
			<div className="flex items-center gap-4 text-lg">
				<span className="font-bold text-2xl text-blue-600">
					{formatPrice(property.price)}
				</span>
				<div className="flex items-center gap-6 text-gray-600">
					<span>{property.bedrooms} beds</span>
					<span>{property.bathrooms} baths</span>
					<span>{property.square_feet?.toLocaleString() || "N/A"} sqft</span>
				</div>
			</div>
		</section>
	)
}
