"use client"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui"
import { ImageCarousel } from "@/components/ui/image-carousel"
import { Property } from "@/types/properties"
import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { PropertyMap } from "./property-map"

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
	const [selectedImageIndex, setSelectedImageIndex] = useState(0)

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-5xl h-[90vh] p-0">
				<DialogHeader className="p-6">
					<DialogTitle>
						{property.title}
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col h-full">
					{/* Main Image Display */}
					<div className="relative flex-1 min-h-0">
						<ImageCarousel
							images={property.images}
							title={property.title}
							currentIndex={selectedImageIndex}
							onIndexChange={setSelectedImageIndex}
							showControls
							fullWidth
						/>
					</div>

					{/* Thumbnail Strip */}
					<div className="p-4 border-t">
						<div className="flex gap-2 overflow-x-auto pb-2">
							{property.images.map((image, index) => (
								<button
									key={index}
									onClick={() => setSelectedImageIndex(index)}
									className={cn(
										"relative w-16 h-16 flex-shrink-0",
										"focus:outline-none focus:ring-2 focus:ring-blue-500",
										selectedImageIndex === index && "ring-2 ring-blue-500"
									)}
								>
									<Image
										src={image}
										alt={`${property.title} - Thumbnail ${index + 1}`}
										fill
										className="object-cover"
									/>
								</button>
							))}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
