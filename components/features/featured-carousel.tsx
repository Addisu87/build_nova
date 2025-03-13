"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
	ChevronLeft,
	ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui"
import { Property } from "@/types/properties"
import { cn } from "@/lib/utils"

interface FeaturedCarouselProps {
	properties: Property[]
}

export function FeaturedCarousel({
	properties,
}: FeaturedCarouselProps) {
	const [currentIndex, setCurrentIndex] =
		useState(0)

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentIndex((prev) =>
				prev === properties.length - 1
					? 0
					: prev + 1,
			)
		}, 5000)

		return () => clearInterval(timer)
	}, [properties.length])

	const handlePrevious = () => {
		setCurrentIndex((prev) =>
			prev === 0
				? properties.length - 1
				: prev - 1,
		)
	}

	const handleNext = () => {
		setCurrentIndex((prev) =>
			prev === properties.length - 1
				? 0
				: prev + 1,
		)
	}

	if (!properties.length) return null

	return (
		<div className="group relative aspect-[21/9] w-full overflow-hidden rounded-lg">
			<div
				className="h-full transition-transform duration-500"
				style={{
					transform: `translateX(-${
						currentIndex * 100
					}%)`,
					width: `${properties.length * 100}%`,
					display: "flex",
				}}
			>
				{properties.map((property) => (
					<Link
						key={property.id}
						href={`/properties/${property.id}`}
						className="relative h-full w-full"
					>
						<Image
							src={property?.image}
							alt={property.title}
							fill
							className="object-cover"
							priority
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
						<div className="absolute bottom-0 left-0 p-6 text-white">
							<h3 className="text-2xl font-bold">
								{property.title}
							</h3>
							<p className="mt-2 text-lg">
								${property.price.toLocaleString()}
							</p>
						</div>
					</Link>
				))}
			</div>

			<Button
				variant="ghost"
				size="icon"
				className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
				onClick={handlePrevious}
			>
				<ChevronLeft className="h-6 w-6 text-white" />
			</Button>

			<Button
				variant="ghost"
				size="icon"
				className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
				onClick={handleNext}
			>
				<ChevronRight className="h-6 w-6 text-white" />
			</Button>

			<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
				{properties.map((_, index) => (
					<button
						key={index}
						className={cn(
							"h-1.5 w-1.5 rounded-full bg-white/80 transition-all",
							index === currentIndex
								? "w-3"
								: "opacity-50",
						)}
						onClick={() => setCurrentIndex(index)}
					/>
				))}
			</div>
		</div>
	)
}
