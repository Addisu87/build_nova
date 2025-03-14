"use client"

import { SearchBar } from "@/components/layout/search-bar"
import { ImageCarousel } from "@/components/ui/image-carousel"
import { LoadingState } from "@/components/ui/loading-state"
import { useAuth } from "@/contexts/auth-context"

const heroImages = [
	"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop&q=80",
	"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80",
	"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop&q=80",
	"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80",
] as const

export function Hero() {
	const { isLoading } = useAuth()

	if (isLoading) {
		return <LoadingState type="hero" />
	}

	return (
		<div className="relative">
			<ImageCarousel
				images={heroImages}
				aspectRatio="hero"
				className="h-[500px]"
				priority
			/>

			<div className="absolute inset-0 z-10">
				<SearchBar />
			</div>
		</div>
	)
}
