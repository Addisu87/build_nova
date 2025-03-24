"use client"

import { SearchBar } from "@/components/layout/search-bar"
import { ImageCarousel } from "@/components/ui/image-carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { usePropertyImages } from "@/hooks/properties/use-property-images"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"

export function Hero() {
	const { listImages, isLoading: imagesLoading } = usePropertyImages()
	const { user, isLoading: authLoading } = useAuth()
	const [heroImages, setHeroImages] = useState<string[]>([])

	useEffect(() => {
		const fetchHeroImages = async () => {
			try {
				// Use a specific folder for hero images
				const images = await listImages("hero")
				setHeroImages(images.map((img) => img.url))
			} catch (error) {
				console.error("Error fetching hero images:", error)
				setHeroImages([]) // Reset to empty array on error
			}
		}

		fetchHeroImages()
	}, [listImages])

	const isLoading = imagesLoading || authLoading

	if (isLoading) {
		return (
			<div className="relative h-[600px] w-full">
				<Skeleton className="absolute inset-0 rounded-none" />
			</div>
		)
	}

	return (
		<div className="relative">
			{heroImages.length > 0 ? (
				<ImageCarousel
					images={heroImages}
					aspectRatio="hero"
					className="h-[600px]"
					priority={true}
					showControls={true}
					fullWidth={true}
					autoPlay={true}
					interval={6000}
				/>
			) : (
				<div className="h-[600px] bg-gray-100 flex justify-center items-center">
					<p className="text-gray-500">No hero images available</p>
				</div>
			)}
			{/* Dark gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20 pointer-events-none" />

			{/* Content container */}
			<div className="absolute inset-0 container mx-auto px-4">
				<div className="h-full flex flex-col justify-center max-w-2xl">
					<div className="mb-8">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
							{user ? `Welcome${user.user_metadata?.full_name ? ` ${user.user_metadata.full_name}` : ''}`
								: 'Find Your Dream Home'}
						</h1>
						<p className="text-lg md:text-xl text-white/90">
							Search through thousands of properties for sale and rent
						</p>
					</div>

					<div className="w-full max-w-xl">
						<SearchBar variant="hero" />
					</div>
				</div>
			</div>
		</div>
	)
}
