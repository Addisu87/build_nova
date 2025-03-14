"use client"

import Image from "next/image"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Grid2X2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PropertyImageCarouselProps {
	images: string[]
	title: string
	fullWidth?: boolean
}

export function PropertyImageCarousel({
	images = [],
	title,
	fullWidth = false,
}: PropertyImageCarouselProps) {
	const [showAllPhotos, setShowAllPhotos] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0)

	if (!images || images.length === 0) {
		return (
			<div className="relative h-[400px] bg-gray-200 flex items-center justify-center">
				<p className="text-gray-500">No images available</p>
			</div>
		)
	}

	const handlePrevious = () => {
		setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
	}

	const handleNext = () => {
		setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
	}

	return (
		<>
			<div 
				className={cn(
					"relative",
					fullWidth ? "h-[550px]" : "h-[400px] rounded-lg overflow-hidden"
				)}
			>
				{/* Main Image Grid */}
				<div className="grid grid-cols-4 h-full">
					{/* Large Main Image */}
					<div className="col-span-2 relative border-r border-white">
						<Image
							src={images[0]}
							alt={`${title} - Main Image`}
							fill
							className="object-cover cursor-pointer"
							onClick={() => setShowAllPhotos(true)}
						/>
					</div>

					{/* Right side grid */}
					<div className="col-span-2 grid grid-rows-2 grid-cols-2">
						{images.slice(1, 5).map((image, index) => (
							<div 
								key={index} 
								className="relative border border-white"
							>
								<Image
									src={image}
									alt={`${title} - Image ${index + 2}`}
									fill
									className="object-cover cursor-pointer"
									onClick={() => setShowAllPhotos(true)}
								/>
							</div>
						))}
					</div>

					{/* Show All Photos Button */}
					<Button
						variant="secondary"
						className="absolute bottom-4 right-4 gap-2 bg-white hover:bg-white/90"
						onClick={() => setShowAllPhotos(true)}
					>
						<Grid2X2 className="h-4 w-4" />
						Show all photos
					</Button>
				</div>
			</div>

			{/* Full Screen Gallery Modal */}
			<Dialog open={showAllPhotos} onOpenChange={setShowAllPhotos}>
				<DialogContent className="max-w-7xl w-full h-[90vh] p-0">
					<div className="relative h-full flex flex-col">
						{/* Header */}
						<div className="p-4 flex justify-between items-center border-b">
							<h3 className="text-lg font-semibold">
								{title} - {currentIndex + 1} of {images.length}
							</h3>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setShowAllPhotos(false)}
							>
								<X className="h-5 w-5" />
							</Button>
						</div>

						{/* Main Gallery View */}
						<div className="flex-1 relative">
							<Image
								src={images[currentIndex]}
								alt={`${title} - Image ${currentIndex + 1}`}
								fill
								className="object-contain"
							/>

							{/* Navigation Buttons */}
							<Button
								variant="ghost"
								size="icon"
								className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
								onClick={handlePrevious}
							>
								<ChevronLeft className="h-6 w-6" />
							</Button>

							<Button
								variant="ghost"
								size="icon"
								className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
								onClick={handleNext}
							>
								<ChevronRight className="h-6 w-6" />
							</Button>
						</div>

						{/* Thumbnails */}
						<div className="p-4 border-t bg-white">
							<div className="flex gap-2 overflow-x-auto pb-2">
								{images.map((image, index) => (
									<button
										key={index}
										className={cn(
											"relative w-20 h-20 flex-shrink-0",
											index === currentIndex && "ring-2 ring-blue-500"
										)}
										onClick={() => setCurrentIndex(index)}
									>
										<Image
											src={image}
											alt={`${title} - Thumbnail ${index + 1}`}
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
		</>
	)
}
