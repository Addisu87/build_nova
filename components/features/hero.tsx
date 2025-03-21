"use client"

import { SearchBar } from "@/components/layout/search-bar"
import { ImageCarousel } from "@/components/ui/image-carousel"
import { LoadingState } from "@/components/ui/loading-state"
import { useAuth } from "@/contexts/auth-context"

// Optimize image URLs with specific sizes and formats
const heroImages = [
	"https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&w=2000&q=75",
	"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=2000&q=75",
	"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&w=2000&q=75",
	"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&w=2000&q=75",
] as const

export function Hero() {
	const { isLoading } = useAuth()

	if (isLoading) {
		return <LoadingState type="hero" />
	}

	return (
		<div className="relative">
			<ImageCarousel
				images={[...heroImages]}
				aspectRatio="hero"
				className="h-[600px]"
				priority={true}
				showControls={true}
				fullWidth={true}
				autoPlay={true}
				interval={6000}
			/>
			{/* Dark gradient overlay - left to right */}
			<div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20 pointer-events-none" />
			{/* Content container */}
			<div className="absolute inset-0 container mx-auto px-4">
				<div className="h-full flex flex-col justify-center max-w-2xl">
					<div className="mb-8">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
							Find Your Dream Home
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
