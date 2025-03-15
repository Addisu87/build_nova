"use client"

import { Property } from "@/types/properties"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
	Calendar,
	Clock,
	Hash,
} from "lucide-react"

interface PropertyDescriptionProps {
	property: Property
}

export function PropertyDescription({
	property,
}: PropertyDescriptionProps) {
	return (
		<Card className="p-6">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-semibold">
						About This Property
					</h2>
					<div className="flex items-center gap-2">
						<Badge variant="outline">
							ID: {property.id}
						</Badge>
						<Badge variant="outline">
							Listed{" "}
							{new Date(
								property.createdAt,
							).toLocaleDateString()}
						</Badge>
					</div>
				</div>

				{/* Quick Facts */}
				<div className="grid grid-cols-3 gap-4 py-4 border-y">
					<div className="flex items-center gap-2">
						<Calendar className="w-4 h-4 text-gray-500" />
						<span className="text-sm">
							Built in{" "}
							{property.yearBuilt || "N/A"}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Clock className="w-4 h-4 text-gray-500" />
						<span className="text-sm">
							Last updated{" "}
							{new Date(
								property.updatedAt,
							).toLocaleDateString()}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Hash className="w-4 h-4 text-gray-500" />
						<span className="text-sm">
							Property ID: {property.id}
						</span>
					</div>
				</div>

				{/* Main Description */}
				<div className="space-y-4">
					<p className="text-gray-600 whitespace-pre-line leading-relaxed">
						{property.description}
					</p>
				</div>

				{/* Amenities */}
				{property.amenities &&
					property.amenities.length > 0 && (
						<div className="space-y-3">
							<h3 className="text-lg font-semibold">
								Amenities
							</h3>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
								{property.amenities.map(
									(amenity) => (
										<div
											key={amenity}
											className="flex items-center gap-2 text-gray-600"
										>
											<span className="w-2 h-2 bg-blue-500 rounded-full" />
											<span>{amenity}</span>
										</div>
									),
								)}
							</div>
						</div>
					)}
			</div>
		</Card>
	)
}
