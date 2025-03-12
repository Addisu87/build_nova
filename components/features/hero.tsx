"use client"

import Image from "next/image"
import { SearchBar } from "@/components/layout/search-bar"

export function Hero() {
	return (
		<div className="relative h-[500px] w-full overflow-hidden rounded-lg">
			{/* Background image with overlay */}
			<div className="absolute inset-0">
				<Image
					src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop&q=80"
					alt="Modern luxury home exterior"
					fill
					priority
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
			</div>

			{/* Content */}
			<div className="relative z-10 flex h-full flex-col items-start justify-center p-8 text-white md:p-12 lg:p-16">
				<h1 className="mb-2 max-w-2xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
					Find Your Perfect Place to Call Home
				</h1>
				<p className="mb-8 max-w-xl text-lg text-gray-200 md:text-xl">
					Discover thousands of properties for sale and rent across the country
				</p>
				<div className="w-full max-w-md">
					<SearchBar />
				</div>
			</div>
		</div>
	)
}