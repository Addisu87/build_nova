"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { SearchBar } from "@/components/layout/search-bar"
import { Button } from "@/components/ui"
import { LoadingState } from "@/components/ui/loading-state"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const heroImages = [
	"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop&q=80",
	"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80",
	"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop&q=80",
	"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80",
]

export function Hero() {
	const [currentIndex, setCurrentIndex] = useState(0)
	const { isLoading } = useAuth()

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1))
		}, 5000)

		return () => clearInterval(timer)
	}, [])

	if (isLoading) {
		return <LoadingState type="hero" />
	}

	const handlePrevious = () => {
		setCurrentIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1))
	}

	const handleNext = () => {
		setCurrentIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1))
	}

	return (
		<div className="group relative h-[500px] w-full overflow-hidden rounded-lg">
			{/* Background images with overlay */}
			<div className="absolute inset-0">
				{heroImages.map((image, index) => (
					<div
						key={index}
						className="absolute inset-0 h-full w-full transition-transform duration-500 ease-in-out"
						style={{
							transform: `translateX(${(index - currentIndex) * 100}%)`,
						}}
					>
						<Image
							src={image}
							alt={`Modern luxury home ${index + 1}`}
							fill
							priority={index === currentIndex}
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
					</div>
				))}
			</div>

			{/* Navigation buttons */}
			<Button
				variant="ghost"
				size="icon"
				className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 hover:bg-white/10 group-hover:opacity-100"
				onClick={handlePrevious}
			>
				<ChevronLeft className="h-6 w-6 text-white" />
			</Button>

			<Button
				variant="ghost"
				size="icon"
				className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 hover:bg-white/10 group-hover:opacity-100"
				onClick={handleNext}
			>
				<ChevronRight className="h-6 w-6 text-white" />
			</Button>

			{/* Dot indicators */}
			<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
				{heroImages.map((_, index) => (
					<button
						key={index}
						className={cn(
							"h-1.5 w-1.5 rounded-full bg-white/80 transition-all",
							index === currentIndex ? "w-3" : "opacity-50"
						)}
						onClick={() => setCurrentIndex(index)}
					/>
				))}
			</div>

			{/* Content */}
			<div className="relative z-10 flex h-full flex-col items-start justify-center p-8 text-white md:p-12 lg:p-16">
				<h1 className="mb-2 max-w-2xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
					Find Your Perfect Place to Call Home
				</h1>
				<p className="mb-8 max-w-xl text-lg text-gray-200 md:text-xl">
					Discover thousands of properties for sale and rent across the country
				</p>
				<SearchBar />
			</div>
		</div>
	)
}