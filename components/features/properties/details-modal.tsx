"use client"

import { Property } from "@/types/properties"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui"

import { PropertyMap } from "./map"

interface PropertyDetailsModalProps {
	property: Property
	isOpen: boolean
	onClose: () => void
}

export function PropertyDetailsModal({
	property,
	isOpen,
	onClose,
}: PropertyDetailsModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>
						{property.title}
					</DialogTitle>
				</DialogHeader>

				<div className="grid gap-6">
					<ImageCarousel
						images={property.images}
						title={property.title}
					/>

					<div className="grid gap-4">
						<div>
							<h3 className="text-lg font-semibold">
								Details
							</h3>
							<div className="mt-2 grid grid-cols-2 gap-4 text-sm">
								<div>
									<span className="font-medium">
										Price:
									</span>{" "}
									$
									{property.price.toLocaleString()}
								</div>
								<div>
									<span className="font-medium">
										Property Type:
									</span>{" "}
									{property.propertyType}
								</div>
								<div>
									<span className="font-medium">
										Bedrooms:
									</span>{" "}
									{property.bedrooms}
								</div>
								<div>
									<span className="font-medium">
										Bathrooms:
									</span>{" "}
									{property.bathrooms}
								</div>
								<div>
									<span className="font-medium">
										Square Feet:
									</span>{" "}
									{property.squareFeet.toLocaleString()}
								</div>
								<div>
									<span className="font-medium">
										Year Built:
									</span>{" "}
									{property.yearBuilt}
								</div>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-semibold">
								Description
							</h3>
							<p className="mt-2 text-sm text-gray-600">
								{property.description}
							</p>
						</div>

						<div>
							<h3 className="text-lg font-semibold">
								Location
							</h3>
							<div className="mt-2">
								<PropertyMap
									property={property}
								/>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
