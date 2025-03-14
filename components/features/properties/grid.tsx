import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
	Button,
	Card,
	Skeleton,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	toast,
} from "@/components/ui"
import { PropertyFilters } from "./filters"
import type {
	PropertyFiltersType,
	Property,
} from "@/types/properties"
import { mockProperties } from "./mock-data" // Temporary for development
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
	Heart,
	Bath,
	Bed,
	Square,
	ArrowUpDown,
} from "lucide-react"
import { usePropertyManager } from "@/hooks/properties/use-property-manager"
import { PropertyCard } from "./card"
import { useFavorites } from "@/hooks/favorites/use-favorites"

export function PropertiesGrid({
	initialProperties = [],
}: {
	initialProperties?: Property[]
}) {
	const { user, isLoading: authLoading } =
		useAuth()
	const {
		filters,
		updateFilters,
		updateSort,
		sortBy,
		isLoading,
		properties = initialProperties.length > 0
			? initialProperties
			: mockProperties,
	} = usePropertyManager()
	const { toggleFavorite, isFavorited } =
		useFavorites()

	const handleFilterChange = (
		newFilters: Partial<PropertyFiltersType>,
	) => {
		updateFilters(newFilters)
	}

	// Only show loading state when both auth and properties are loading
	if (isLoading || authLoading) {
		return (
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row justify-between gap-4">
					{/* Filters skeleton */}
					<div className="w-full">
						<Skeleton className="h-10 w-full" />
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mt-4">
							{Array.from({ length: 5 }).map(
								(_, i) => (
									<Skeleton
										key={i}
										className="h-10 w-full"
									/>
								),
							)}
						</div>
					</div>
				</div>

				{/* Property cards skeleton */}
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }).map(
						(_, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.3,
									delay: i * 0.1,
								}}
							>
								<div className="rounded-lg overflow-hidden">
									<Skeleton className="h-48 w-full" />
									<div className="p-4 space-y-3">
										<Skeleton className="h-6 w-3/4" />
										<Skeleton className="h-4 w-1/2" />
										<div className="flex gap-4">
											<Skeleton className="h-4 w-16" />
											<Skeleton className="h-4 w-16" />
											<Skeleton className="h-4 w-16" />
										</div>
									</div>
								</div>
							</motion.div>
						),
					)}
				</div>
			</div>
		)
	}

	// Show empty state if no properties
	if (!properties || properties.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-500">
					No properties found.
				</p>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between gap-4">
				<PropertyFilters
					filters={filters}
					onChange={handleFilterChange}
					sort={sortBy}
					onSortChange={updateSort}
				/>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{properties.map((property) => (
					<motion.div
						key={property.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<PropertyCard
							property={property}
							onFavoriteToggle={() =>
								toggleFavorite(property.id)
							}
							isFavorited={isFavorited(
								property.id,
							)}
						/>
					</motion.div>
				))}
			</div>
		</div>
	)
}
