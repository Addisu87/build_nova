"use client"

import { SearchBar } from "@/components/layout/search-bar"
import { ImageCarousel } from "@/components/ui/image-carousel"
import { LoadingState } from "@/components/ui/loading-state"
import { usePropertyImages } from "@/hooks/properties/use-property-images"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"

export function Hero() {
	const { user, isLoading: authLoading } = useAuth()
	const { listImages } = usePropertyImages()
	const [heroImages, setHeroImages] = useState<string[]>([])
	const [isLoadingImages, setIsLoadingImages] = useState(true)

	useEffect(() => {
		const fetchHeroImages = async () => {
			try {
				setIsLoadingImages(true)
				const images = await listImages("hero")
				setHeroImages(images.map(img => img.url))
			} catch (error) {
				console.error("Error fetching hero images:", error)
				setHeroImages([])
			} finally {
				setIsLoadingImages(false)
			}
		}

		fetchHeroImages()
	}, [listImages])

	// Only show loading state during initial load
	if (authLoading || isLoadingImages) {
		return <LoadingState type="hero" />
	}

	const welcomeMessage = user?.user_metadata?.full_name 
		? `Welcome ${user.user_metadata.full_name}`
		: user 
			? 'Welcome'
			: 'Find Your Dream Home'

	return (
		<div className="relative">
			{heroImages.length > 0 ? (
				<ImageCarousel
					images={heroImages}
					aspectRatio="hero"
					className="h-[600px]"
					priority={true}
					showControls={heroImages.length > 1}
					fullWidth={true}
					autoPlay={heroImages.length > 1}
					interval={6000}
				/>
			) : (
				<div className="h-[600px] bg-gray-100 dark:bg-gray-800 flex justify-center items-center">
					<p className="text-gray-500 dark:text-gray-400">No hero images available</p>
				</div>
			)}
			{/* Dark gradient overlay */}
			<div 
				className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20 pointer-events-none"
				aria-hidden="true"
			/>

			{/* Content container */}
			<div className="absolute inset-0 container mx-auto px-4">
				<div className="h-full flex flex-col justify-center max-w-2xl">
					<div className="mb-8">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
							{welcomeMessage}
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
