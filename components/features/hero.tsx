"use client"

import { SearchBar } from "@/components/layout/search-bar";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { useAuth } from "@/contexts/auth-context";

const DEFAULT_HERO_IMAGES = [
	"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=2000&q=75",
	"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&w=2000&q=75",
	"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&w=2000&q=75",
]

export function Hero() {
	const { user } = useAuth()

	const welcomeMessage = user?.user_metadata?.full_name
		? `Welcome ${user.user_metadata.full_name}`
		: user
		? "Welcome"
		: "Find Your Dream Home"

	return (
		<div className="relative">
			<ImageCarousel
				images={DEFAULT_HERO_IMAGES}
				aspectRatio="hero"
				className="h-[600px]"
				priority={true}
				showControls={true}
				fullWidth={true}
				autoPlay={true}
				interval={6000}
				title="Hero Section"
			/>

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
