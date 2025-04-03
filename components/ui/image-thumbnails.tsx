"use client"

import { cn } from "@/lib/utils"
import { ImageOff } from "lucide-react"
import Image from "next/image"

interface ImageThumbnailsProps {
	images: string[]
	currentIndex: number
	onSelect: (index: number) => void
	title?: string
	className?: string
}

export function ImageThumbnails({
	images = [],
	currentIndex,
	onSelect,
	title,
	className,
}: ImageThumbnailsProps) {
	// Show placeholders if no images
	if (!images || images.length === 0) {
		return (
			<div className={cn("grid grid-cols-1 md:grid-cols-4 gap-2 h-[600px]", className)}>
				{/* Main large placeholder */}
				<div className="md:col-span-2 relative h-full">
					<div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
						<div className="text-gray-400 dark:text-gray-500 flex flex-col items-center">
							<ImageOff className="h-12 w-12 mb-2" />
							<span className="text-sm">No images available</span>
						</div>
					</div>
				</div>
				{/* Smaller placeholder thumbnails */}
				<div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
					{[...Array(4)].map((_, idx) => (
						<div
							key={idx}
							className="relative h-[295px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"
						>
							<div className="text-gray-400 dark:text-gray-500 flex flex-col items-center">
								<ImageOff className="h-8 w-8 mb-1" />
							</div>
						</div>
					))}
				</div>
			</div>
		)
	}

	const displayImages = images.slice(0, 5)
	const defaultPlaceholder = '/placeholder-property.jpg'

	return (
		<div className={cn("grid grid-cols-1 md:grid-cols-4 gap-2 h-[600px]", className)}>
			{/* Main large image */}
			<div className="md:col-span-2 relative h-full">
				<button
					onClick={() => onSelect(0)}
					className={cn(
						"relative w-full h-full",
						"hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-blue-500",
					)}
				>
					<Image
						src={images[0] || defaultPlaceholder}
						alt={`${title} - Main Image`}
						fill
						className="object-cover rounded-lg"
						sizes="(max-width: 768px) 100vw, 50vw"
						priority
						onError={(e) => {
							const img = e.target as HTMLImageElement
							img.src = defaultPlaceholder
						}}
					/>
				</button>
			</div>

			{/* Right side smaller images grid */}
			<div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
				{[...Array(4)].map((_, idx) => {
					const actualIndex = idx + 1
					const image = displayImages[actualIndex]
					const isLastVisible = actualIndex === 4 && images.length > 5

					return (
						<button
							key={actualIndex}
							onClick={() => image && onSelect(actualIndex)}
							className={cn(
								"relative h-[295px]",
								"hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-blue-500",
							)}
						>
							{image ? (
								<>
									<Image
										src={image || defaultPlaceholder}
										alt={`${title} - Image ${actualIndex + 1}`}
										fill
										className="object-cover rounded-lg"
										sizes="25vw"
										onError={(e) => {
											const img = e.target as HTMLImageElement
											img.src = defaultPlaceholder
										}}
									/>
									{isLastVisible && images.length > 5 && (
										<div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
											<span className="text-white text-lg font-medium">
												+{images.length - 4}
											</span>
										</div>
									)}
								</>
							) : (
								<div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
									<div className="text-gray-400 dark:text-gray-500 flex flex-col items-center">
										<ImageOff className="h-8 w-8 mb-1" />
									</div>
								</div>
							)}
						</button>
					)
				})}
			</div>
		</div>
	)
}
