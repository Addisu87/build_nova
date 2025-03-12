import { useState } from "react"
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
import {
	type PropertyFilters as PropertyFiltersType,
	type SortOption,
} from "./types"
import { mockProperties } from "./mock-data"
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
const { isLoading } = useAuth()

export function PropertiesGrid() {
	const { user } = useAuth()
	const {
		filters,
		updateFilters,
		sort,
		updateSort,
	} = usePropertyManager()

	// Update filter handling to match new filter structure
	const handleFilterChange = (
		newFilters: Partial<PropertyFiltersType>,
	) => {
		updateFilters({
			minPrice:
				Number(newFilters.minPrice) || undefined,
			maxPrice:
				Number(newFilters.maxPrice) || undefined,
			bedrooms:
				Number(newFilters.bedrooms) || undefined,
			bathrooms:
				Number(newFilters.bathrooms) || undefined,
			propertyType:
				newFilters.propertyType || undefined,
		})
	}

	const filteredProperties =
		mockProperties.filter((property) => {
			if (
				filters.minPrice &&
				property.price < filters.minPrice
			)
				return false
			if (
				filters.maxPrice &&
				property.price > filters.maxPrice
			)
				return false
			if (
				filters.bedrooms &&
				property.bedrooms < filters.bedrooms
			)
				return false
			if (
				filters.bathrooms &&
				property.bathrooms < filters.bathrooms
			)
				return false
			if (
				filters.propertyType &&
				property.propertyType.toLowerCase() !==
					filters.propertyType
			)
				return false
			return true
		})

	const sortedProperties = [
		...filteredProperties,
	].sort((a, b) => {
		switch (sort.sortBy) {
			case "price_asc":
				return a.price - b.price
			case "price_desc":
				return b.price - a.price
			case "newest":
				return (
					new Date(b.createdAt).getTime() -
					new Date(a.createdAt).getTime()
				)
			case "oldest":
				return (
					new Date(a.createdAt).getTime() -
					new Date(b.createdAt).getTime()
				)
			default:
				return 0
		}
	})

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3].map((i) => (
					<Card
						key={i}
						className="overflow-hidden"
					>
						<Skeleton className="h-48 w-full" />
						<div className="p-4 space-y-2">
							<Skeleton className="h-4 w-2/3" />
							<Skeleton className="h-4 w-1/2" />
							<div className="flex justify-between mt-4">
								<Skeleton className="h-4 w-1/4" />
								<Skeleton className="h-4 w-1/4" />
							</div>
						</div>
					</Card>
				))}
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between gap-4">
				<PropertyFilters
					filters={filters}
					onChange={handleFilterChange}
				/>
				<div className="flex items-center gap-2">
					<ArrowUpDown className="h-4 w-4" />
					<Select
						value={sort.sortBy}
						onValueChange={updateSort}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(
								sort.sortOptions,
							).map(([value, label]) => (
								<SelectItem
									key={value}
									value={value}
								>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{sortedProperties.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-gray-600 mb-4">
						No properties match your current
						filters
					</p>
					<Button
						variant="outline"
						onClick={() =>
							setFilters({
								minPrice: "",
								maxPrice: "",
								bedrooms: "",
								bathrooms: "",
								propertyType: "",
							})
						}
					>
						Clear Filters
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{sortedProperties.map((property) => (
						<motion.div
							key={property.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							<PropertyCard
								property={property}
								onFavorite={toggleFavorite}
								isFavorite={isFavorited(
									property.id,
								)}
							/>
						</motion.div>
					))}
				</div>
			)}
		</div>
	)
}

// Update clear filters handler
;<Button
	variant="outline"
	onClick={() =>
		updateFilters({
			minPrice: undefined,
			maxPrice: undefined,
			bedrooms: undefined,
			bathrooms: undefined,
			propertyType: undefined,
		})
	}
>
	Clear Filters
</Button>
