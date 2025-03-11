"use client"

import Image from "next/image"
import { useState } from "react"
import {
	ChevronLeft,
	ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui"
import { cn } from "@/lib/utils"

interface PropertyImageCarouselProps {
	images: string[]
	title: string
}

export function PropertyImageCarousel({
	images,
	title,
}: PropertyImageCarouselProps) {
	const [currentIndex, setCurrentIndex] =
		useState(0)

	const handlePrevious = () => {
		setCurrentIndex((prev) =>
			prev === 0 ? images.length - 1 : prev - 1,
		)
	}

	const handleNext = () => {
		setCurrentIndex((prev) =>
			prev === images.length - 1 ? 0 : prev + 1,
		)
	}

	return (
		<div className="group relative h-48">
			<Image
				src={images[currentIndex]}
				alt={`${title} - Image ${
					currentIndex + 1
				}`}
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
						<ChevronLeft className="h-6 w-6" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
						onClick={handleNext}
					>
						<ChevronRight className="h-6 w-6" />
					</Button>
					<div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
						{images.map((_, index) => (
							<button
								key={index}
								className={cn(
									"h-1.5 w-1.5 rounded-full bg-white/80 transition-all",
									index === currentIndex
										? "w-3"
										: "opacity-50",
								)}
								onClick={() =>
									setCurrentIndex(index)
								}
							/>
						))}
					</div>
				</>
			)}
		</div>
	)
}
