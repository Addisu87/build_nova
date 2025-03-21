"use client"

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Property } from "@/types"
import { Building2, Car, Home, Ruler, Trees } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface NearbyPropertiesProps {
	currentProperty: Property
	nearbyProperties: Property[]
}

export function NearbyProperties({
	currentProperty,
	nearbyProperties,
}: NearbyPropertiesProps) {
	const router = useRouter()

	const formatPrice = (price: number) => {
		return price >= 1000000
			? `$${(price / 1000000).toFixed(1)}M`
			: `$${(price / 1000).toFixed(0)}K`
	}

	const calculateDistance = (loc1: any, loc2: any) => {
		// Implement actual distance calculation
		return "0.5 mi away"
	}

	const PropertyFeature = ({
		icon: Icon,
		label,
		value,
	}: {
		icon: any
		label: string
		value: string | number
	}) => (
		<div className="flex items-center gap-2">
			<Icon className="h-4 w-4 text-gray-500" />
			<span className="text-sm text-gray-600">
				{label}: <span className="font-medium text-gray-900">{value}</span>
			</span>
		</div>
	)

	return (
		<div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
			<h3 className="text-lg font-semibold p-4 border-b flex-shrink-0">
				Nearby Properties
			</h3>
			<div className="overflow-y-auto flex-1">
				<Accordion type="single" collapsible className="divide-y">
					{nearbyProperties.map((property) => (
						<AccordionItem
							key={property.id}
							value={property.id}
							className="border-none"
						>
							<div className="p-4">
								<div className="flex gap-4">
									{/* Property Image */}
									<div className="relative h-32 w-40 flex-shrink-0">
										<Image
											src={property.images?.[0] || property.imageUrl}
											alt={property.title}
											fill
											className="object-cover rounded-lg"
										/>
										<Badge
											variant={property.status === "for-sale" ? "success" : "secondary"}
											className="absolute top-2 left-2"
										>
											{property.status === "for-sale" ? "For Sale" : "For Rent"}
										</Badge>
									</div>

									{/* Property Basic Info */}
									<div className="flex-1 min-w-0">
										<div className="flex items-baseline justify-between mb-1">
											<h4 className="font-semibold text-lg text-gray-900">
												{formatPrice(property.price)}
											</h4>
											<span className="text-sm text-gray-500">
												{calculateDistance(currentProperty.location, property.location)}
											</span>
										</div>

										<h5 className="text-base font-medium text-gray-900 truncate mb-1">
											{property.title}
										</h5>

										<p className="text-sm text-gray-600 truncate mb-2">
											{property.address}
										</p>

										<div className="flex items-center gap-3 text-sm text-gray-600">
											<span>{property.bedrooms} beds</span>
											<span>•</span>
											<span>{property.bathrooms} baths</span>
											<span>•</span>
											<span>{property.square_feet.toLocaleString()} sqft</span>
										</div>
									</div>
								</div>

								{/* Accordion Trigger for Additional Details */}
								<AccordionTrigger className="pt-2 pb-0">
									<span className="text-sm text-gray-600">View Details</span>
								</AccordionTrigger>
							</div>

							<AccordionContent className="px-4 pb-4">
								<div className="space-y-4">
									{/* Property Features */}
									<div className="grid grid-cols-2 gap-3">
										<PropertyFeature
											icon={Home}
											label="Property Type"
											value={property.property_type}
										/>
										<PropertyFeature
											icon={Building2}
											label="Year Built"
											value={property.year_built}
										/>
										<PropertyFeature
											icon={Car}
											label="Parking"
											value={property.parking_spaces || "N/A"}
										/>
										<PropertyFeature
											icon={Ruler}
											label="Lot Size"
											value={`${property.lot_size?.toLocaleString() || "N/A"} sqft`}
										/>
										<PropertyFeature
											icon={Trees}
											label="Amenities"
											value={property.amenities?.join(", ") || "None"}
										/>
									</div>

									{/* Description */}
									<div>
										<h6 className="font-medium text-sm mb-1">Description</h6>
										<p className="text-sm text-gray-600 line-clamp-3">
											{property.description}
										</p>
									</div>

									{/* View Property Button */}
									<Button
										onClick={() => router.push(`/properties/${property.id}`)}
										className="w-full"
									>
										View Property
									</Button>
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	)
}
