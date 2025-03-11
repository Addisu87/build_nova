import { useState } from "react"
import { useAuth } from "@/hooks/auth/use-auth"
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

export function PropertiesGrid() {
	const { user, loading } = useAuth()
	const [filters, setFilters] =
		useState<PropertyFiltersType>({
			minPrice: "",
			maxPrice: "",
			bedrooms: "",
			bathrooms: "",
			propertyType: "",
		})
	const [sortBy, setSortBy] =
		useState<SortOption>("newest")
	const [favorites, setFavorites] = useState<
		Set<string>
	>(new Set())

	const handleFilterChange = (
		newFilters: Partial<PropertyFiltersType>,
	) => {
		setFilters((prev) => ({
			...prev,
			...newFilters,
		}))
	}

	const handleToggleFavorite = (
		propertyId: string,
	) => {
		if (!user) {
			toast({
				title: "Authentication required",
				description:
					"Please sign in to save properties to your favorites",
				variant: "destructive",
			})
			return
		}

		setFavorites((prev) => {
			const newFavorites = new Set(prev)
			if (newFavorites.has(propertyId)) {
				newFavorites.delete(propertyId)
				toast({
					title: "Removed from favorites",
					description:
						"Property removed from your favorites",
				})
			} else {
				newFavorites.add(propertyId)
				toast({
					title: "Added to favorites",
					description:
						"Property added to your favorites",
				})
			}
			return newFavorites
		})
	}

	const filteredProperties =
		mockProperties.filter((property) => {
			if (
				filters.minPrice &&
				property.price <
					parseInt(filters.minPrice)
			)
				return false
			if (
				filters.maxPrice &&
				property.price >
					parseInt(filters.maxPrice)
			)
				return false
			if (
				filters.bedrooms &&
				property.bedrooms <
					parseInt(filters.bedrooms)
			)
				return false
			if (
				filters.bathrooms &&
				property.bathrooms <
					parseInt(filters.bathrooms)
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
		switch (sortBy) {
			case "price-asc":
				return a.price - b.price
			case "price-desc":
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

	if (loading) {
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
						value={sortBy}
						onValueChange={(value: SortOption) =>
							setSortBy(value)
						}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="price-asc">
								Price: Low to High
							</SelectItem>
							<SelectItem value="price-desc">
								Price: High to Low
							</SelectItem>
							<SelectItem value="newest">
								Newest First
							</SelectItem>
							<SelectItem value="oldest">
								Oldest First
							</SelectItem>
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
							initial={{
								opacity: 0,
								y: 20,
							}}
							animate={{
								opacity: 1,
								y: 0,
							}}
							transition={{
								duration: 0.3,
							}}
						>
							<Card className="overflow-hidden group">
								<div className="relative">
									<Image
										src={property.imageUrl}
										alt={property.title}
										width={800}
										height={400}
										className="h-48 w-full object-cover transition-transform group-hover:scale-105"
									/>
									<button
										onClick={() =>
											handleToggleFavorite(
												property.id,
											)
										}
										className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
									>
										<Heart
											className={`h-4 w-4 ${
												favorites.has(property.id)
													? "fill-red-500 text-red-500"
													: "text-gray-500"
											}`}
										/>
									</button>
								</div>
								<div className="p-4">
									<h3 className="font-semibold text-lg mb-2">
										{property.title}
									</h3>
									<p className="text-2xl font-bold text-primary mb-2">
										$
										{property.price.toLocaleString()}
									</p>
									<p className="text-gray-600 mb-4">
										{property.location}
									</p>
									<div className="flex justify-between text-gray-500">
										<div className="flex items-center gap-1">
											<Bed className="h-4 w-4" />
											<span>
												{property.bedrooms}
											</span>
										</div>
										<div className="flex items-center gap-1">
											<Bath className="h-4 w-4" />
											<span>
												{property.bathrooms}
											</span>
										</div>
										<div className="flex items-center gap-1">
											<Square className="h-4 w-4" />
											<span>
												{property.area} sqft
											</span>
										</div>
									</div>
								</div>
							</Card>
						</motion.div>
					))}
				</div>
			)}
		</div>
	)
}
