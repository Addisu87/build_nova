import { Button } from "@/components/ui/button"
import { ImageCarousel } from "@/components/ui/image-carousel"
import { useFavorites } from "@/hooks/favorites/use-favorites"
import { formatPrice } from "@/lib/utils"
import { Database } from "@/types/supabase"
import { Bath, Bed, Heart, Square } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

type Property = Database["public"]["Tables"]["properties"]["Row"]

interface PropertyCardProps {
	property: Property
	variant?: "default" | "compact"
}

export function PropertyCard({ property, variant = "default" }: PropertyCardProps) {
	const { isFavorite, addFavorite, removeFavorite, getFavoriteId } = useFavorites()
	const [isHovered, setIsHovered] = useState(false)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)

	const handleFavoriteClick = async (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		try {
			const favoriteId = getFavoriteId(property.id)
			if (favoriteId) {
				await removeFavorite(favoriteId)
			} else {
				await addFavorite(property)
			}
		} catch (err) {
			console.error("Failed to toggle favorite:", err)
		}
	}

	const handleCardClick = (e: React.MouseEvent) => {
		// Check if the click target is a carousel control button
		const target = e.target as HTMLElement
		if (
			target.closest("button") &&
			!target.closest("button")?.classList.contains("favorite-btn")
		) {
			e.preventDefault()
		}
	}

	return (
		<Link href={`/properties/${property.id}`} onClick={handleCardClick}>
			<div
				className="group relative overflow-hidden rounded-xl bg-white drop-shadow-md 
					transition-all duration-300 hover:drop-shadow-xl dark:bg-gray-800/90"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{/* Image Section */}
				<div className="relative aspect-[4/3] overflow-hidden">
					<ImageCarousel
						images={property.images}
						aspectRatio="property"
						showControls={isHovered && property.images.length > 1}
						autoPlay={false}
						interval={3000}
						currentIndex={currentImageIndex}
						onIndexChange={setCurrentImageIndex}
						preventNavigation={false}
						className="w-full h-full"
					/>

					{/* Status Badge */}
					<div className="absolute left-3 top-3 z-20">
						<span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
							{property.status}
						</span>
					</div>

					{/* Favorite Button */}
					<Button
						variant="ghost"
						size="icon"
						className={`favorite-btn absolute right-3 top-3 z-20 h-12 w-12 rounded-full 
							bg-transparent hover:bg-transparent transition-all duration-300 hover:scale-110`}
						onClick={handleFavoriteClick}
					>
						<Heart
							strokeWidth={2.5}
							className={`h-12 w-12 transition-all duration-300 
								${
									isFavorite(property.id)
										? "fill-red-500 text-red-500"
										: "fill-transparent text-white hover:text-red-500"
								}`}
						/>
					</Button>
				</div>

				{/* Content Section */}
				<div className="space-y-3 p-4">
					{/* Price and Type */}
					<div className="flex items-center justify-between">
						<span className="text-xl font-bold text-primary">
							{formatPrice(property.price)}
						</span>
						<span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
							{property.property_type}
						</span>
					</div>

					{/* Title and Address */}
					<div>
						<h3 className="line-clamp-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
							{property.title}
						</h3>
						<p className="line-clamp-1 text-sm text-gray-500 dark:text-gray-400">
							{property.address}
						</p>
					</div>

					{/* Property Details */}
					{variant === "default" && (
						<div className="flex items-center gap-4 border-t pt-3 text-sm text-gray-600 dark:text-gray-300">
							<div className="flex items-center gap-1">
								<Bed className="h-4 w-4" />
								<span>{property.bedrooms} beds</span>
							</div>
							<div className="flex items-center gap-1">
								<Bath className="h-4 w-4" />
								<span>{property.bathrooms} baths</span>
							</div>
							<div className="flex items-center gap-1">
								<Square className="h-4 w-4" />
								<span>{property.square_feet.toLocaleString()} sq ft</span>
							</div>
						</div>
					)}
				</div>

				{/* Hover Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
			</div>
		</Link>
	)
}
