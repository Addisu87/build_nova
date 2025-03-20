"use client"

import { cn } from "@/lib/utils";
import Image from "next/image";

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
	// Ensure `images` is defined and has at least one element
	if (!images || images.length === 0) {
		return null
	}

	const displayImages = images?.slice(0, 5)

	return (
		<div className={cn("grid grid-cols-1 md:grid-cols-4 gap-2 h-[600px]", className)}>
			{/* Main large image */}
			<div className="md:col-span-2 relative h-full">
				<button
					onClick={() => onSelect(0)}
					className={cn(
						"relative w-full h-full",
						"hover:opacity-95 focus:outline-none",
					)}
				>
					<Image
						src={images[0]}
						alt={`${title} - Main Image`}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, 50vw"
						priority
					/>
				</button>
			</div>

			{/* Right side smaller images grid */}
			<div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
				{displayImages.slice(1)?.map((image, idx) => {
					const actualIndex = idx + 1
					const isLastVisible = actualIndex === 4 && images.length > 5

					return (
						<button
							key={actualIndex}
							onClick={() => image && onSelect(actualIndex)}
							className={cn(
								"relative h-[295px]", // Set explicit height for each thumbnail
								"hover:opacity-95 focus:outline-none focus:ring-2",
							)}
						>
							<Image
								src={image}
								alt={`${title} - Image ${actualIndex + 1}`}
								fill
								className="object-cover rounded-lg"
								sizes="25vw"
							/>
							{isLastVisible && images.length > 5 && (
								<div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
									<span className="text-white text-lg font-medium">
										+{images.length - 4}
									</span>
								</div>
							)}
						</button>
					)
				})}
			</div>
		</div>
	)
}
