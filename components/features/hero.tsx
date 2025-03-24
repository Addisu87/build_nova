"use client"

import { SearchBar } from "@/components/layout/search-bar"
import { ImageCarousel } from "@/components/ui/image-carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export function Hero() {
	const { isLoading: authIsLoading } = useAuth()
	const [heroImages, setHeroImages] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		const fetchHeroImages = async () => {
			try {
				setIsLoading(true)
				setError(null)

				// Fetch file names from 'hero' folder in 'images' bucket
				const { data: files, error: listError } = await supabase.storage
					.from("images")
					.list("hero", {
						limit: 100,
						sortBy: { column: "created_at", order: "desc" },
					})

				console.log("List response from 'hero':", { files, listError })

				if (listError) {
					console.error("List error:", listError)
					throw listError
				}

				if (!files || files.length === 0) {
					console.warn("No files found in images/hero/")
					setHeroImages([])
					return
				}

				// Extract file names and get public URLs using Supabase's getPublicUrl method
				const imageUrls = files
					.filter((file) => /\.(jpg|jpeg|png|gif|avif)$/i.test(file.name))
					.map((file) => {
						const { data } = supabase.storage
							.from("images")
							.getPublicUrl(`hero/${file.name}`)

						console.log(`Generated URL for ${file.name}:`, data.publicUrl)
						return data.publicUrl
					})

				setHeroImages(imageUrls)
			} catch (err) {
				console.error("Error fetching hero images:", err)
				setError(err instanceof Error ? err : new Error("Failed to fetch hero images"))
				setHeroImages([])
			} finally {
				setIsLoading(false)
			}
		}

		fetchHeroImages()
	}, [])

	if (authIsLoading || isLoading) {
		return (
			<div className="relative h-[600px] w-full">
				<Skeleton className="absolute inset-0 rounded-none" />
			</div>
		)
	}

	if (error) {
		return (
			<div className="h-[600px] bg-gray-100 flex flex-col justify-center items-center">
				<p className="text-red-500">Error loading hero images: {error.message}</p>
				<button
					onClick={() => window.location.reload()} // Simple retry via page reload
					className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Retry
				</button>
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
