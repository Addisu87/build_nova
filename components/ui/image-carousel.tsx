"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageCarouselProps {
	images: string[]
	title?: string
	aspectRatio?:
		| "square"
		| "video"
		| "portrait"
		| "hero"
		| "property"
	priority?: boolean
	showControls?: boolean
	className?: string
	fullWidth?: boolean
	currentIndex?: number
	onIndexChange?: (index: number) => void
	autoPlay?: boolean
	interval?: number
	preventNavigation?: boolean
}

const aspectRatioClasses = {
	square: "aspect-square",
	video: "aspect-video",
	portrait: "aspect-[3/4]",
	hero: "h-[500px]",
	property: "aspect-[4/3]",
}

export function ImageCarousel({
	images,
	title = "",
	aspectRatio = "square",
	priority = false,
	showControls = false,
	className,
	fullWidth = false,
	currentIndex = 0,
	onIndexChange,
	autoPlay = false,
	interval = 5000,
	preventNavigation = false
}: ImageCarouselProps) {
	const [localCurrentIndex, setLocalCurrentIndex] = React.useState(currentIndex)
	const [isHovered, setIsHovered] = React.useState(false)

	const activeIndex = onIndexChange ? currentIndex : localCurrentIndex

	React.useEffect(() => {
		if (!autoPlay || isHovered) return

		const timer = setInterval(() => {
			const newIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0
			onIndexChange ? onIndexChange(newIndex) : setLocalCurrentIndex(newIndex)
		}, interval)

		return () => clearInterval(timer)
	}, [autoPlay, interval, activeIndex, images.length, onIndexChange, isHovered])

	const handleNext = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		const newIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0
		onIndexChange ? onIndexChange(newIndex) : setLocalCurrentIndex(newIndex)
	}

	const handlePrevious = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		const newIndex = activeIndex > 0 ? activeIndex - 1 : images.length - 1
		onIndexChange ? onIndexChange(newIndex) : setLocalCurrentIndex(newIndex)
	}

	const handleDotClick = (e: React.MouseEvent, index: number) => {
		e.preventDefault()
		e.stopPropagation()
		onIndexChange ? onIndexChange(index) : setLocalCurrentIndex(index)
	}

	const heightClass = fullWidth ? "h-[550px]" : "h-[400px]"
	const finalClassName = cn(className, fullWidth ? heightClass : '')

	if (!images?.length) {
		return (
			<div className={cn(
				"relative bg-gray-200 flex items-center justify-center",
				aspectRatioClasses[aspectRatio],
				finalClassName
			)}>
				<p className="text-gray-500">No images available</p>
			</div>
		)
	}

	return (
		<div 
			className="relative group"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Main Image */}
			<div className={cn(
				"relative w-full overflow-hidden",
				aspectRatioClasses[aspectRatio],
				finalClassName
			)}>
				<Image
					src={images[activeIndex]}
					alt={`${title} - Image ${activeIndex + 1}`}
					fill
					className="object-cover"
					priority={priority}
					sizes={fullWidth ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
				/>
			</div>

			{showControls && (
				<>
					{/* Navigation Buttons */}
					<button
						onClick={handlePrevious}
						className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-105 focus:outline-none opacity-0 group-hover:opacity-100"
					>
						<ChevronLeft className="h-4 w-4" />
					</button>
					<button
						onClick={handleNext}
						className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-105 focus:outline-none opacity-0 group-hover:opacity-100"
					>
						<ChevronRight className="h-4 w-4" />
					</button>

					{/* Dots Navigation */}
					<div 
						className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5"
						onClick={preventNavigation ? (e) => e.stopPropagation() : undefined}
					>
						{images.map((_, index) => (
							<button
								key={index}
								onClick={(e) => handleDotClick(e, index)}
								className={cn(
									"w-1.5 h-1.5 rounded-full transition-all duration-200",
									activeIndex === index
										? "bg-white w-2.5"
										: "bg-white/70 hover:bg-white/90"
								)}
								aria-label={`Go to image ${index + 1}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	)
}
