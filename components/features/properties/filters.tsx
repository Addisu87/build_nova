"use client"

import {
	Button,
	Checkbox,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui"
import {
	AMENITIES,
	PROPERTY_TYPES,
	PropertyFilters as PropertyFiltersType,
	PropertyType,
	SORT_OPTIONS,
	SortOption,
} from "@/types"
import { motion } from "framer-motion"
import { useState } from "react"

interface PropertyFiltersProps {
	filters: PropertyFiltersType
	onChange: (filters: Partial<PropertyFiltersType>) => void
	sort: SortOption
	onSortChange: (sort: SortOption) => void
	className?: string
}

export function PropertyFilters({
	filters,
	onChange,
	sort,
	onSortChange,
	className = "",
}: PropertyFiltersProps) {
	const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

	const handleChange = (field: keyof PropertyFiltersType, value: any) => {
		onChange({ [field]: value })
	}

	const handleAmenityChange = (amenity: string) => {
		const currentAmenities = filters.amenities || []
		const newAmenities = currentAmenities.includes(amenity)
			? currentAmenities.filter((a) => a !== amenity)
			: [...currentAmenities, amenity]
		handleChange("amenities", newAmenities)
	}

	const handleReset = () => {
		onChange({
			minPrice: "",
			maxPrice: "",
			bedrooms: "",
			bathrooms: "",
			propertyType: "",
			location: "",
			amenities: [],
			squareFootage: { min: "", max: "" },
			yearBuilt: { min: "", max: "" },
		})
	}

	return (
		<div className={`space-y-4 ${className}`}>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
				{/* Price Range */}
				<div className="space-y-2">
					<Label>Price Range</Label>
					<div className="flex space-x-2">
						<Input
							type="number"
							placeholder="Min"
							value={filters.minPrice}
							onChange={(e) => handleChange("minPrice", e.target.value)}
						/>
						<Input
							type="number"
							placeholder="Max"
							value={filters.maxPrice}
							onChange={(e) => handleChange("maxPrice", e.target.value)}
						/>
					</div>
				</div>

				{/* Bedrooms */}
				<div className="space-y-2">
					<Label>Bedrooms</Label>
					<Select
						value={filters.bedrooms || "any"}
						onValueChange={(value) =>
							handleChange("bedrooms", value === "any" ? "" : value)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Any" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="any">Any</SelectItem>
							{[1, 2, 3, 4, 5].map((num) => (
								<SelectItem key={num} value={num.toString()}>
									{num}+ beds
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Property Type */}
				<div className="space-y-2">
					<Label>Property Type</Label>
					<Select
						value={filters.propertyType || "any"}
						onValueChange={(value) =>
							handleChange(
								"propertyType",
								value === "any" ? "" : (value as PropertyType),
							)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Any" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="any">Any</SelectItem>
							{Object.entries(PROPERTY_TYPES).map(([value, label]) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Location */}
				<div className="space-y-2">
					<Label>Location</Label>
					<Input
						type="text"
						placeholder="Enter location"
						value={filters.location}
						onChange={(e) => handleChange("location", e.target.value)}
					/>
				</div>

				{/* Sort By */}
				<div className="space-y-2">
					<Label>Sort By</Label>
					<Select value={sort} onValueChange={onSortChange}>
						<SelectTrigger>
							<SelectValue placeholder="Sort by..." />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(SORT_OPTIONS).map(([value, label]) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="flex space-x-2">
				<Button variant="outline" onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}>
					{isAdvancedOpen ? "Less Filters" : "More Filters"}
				</Button>
				<Button variant="ghost" onClick={handleReset}>
					Reset Filters
				</Button>
			</div>

			{/* Advanced Filters */}
			{isAdvancedOpen && (
				<motion.div
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: "auto", opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					className="space-y-4"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Square Footage */}
						<div className="space-y-2">
							<Label>Square Footage</Label>
							<div className="flex space-x-2">
								<Input
									type="number"
									placeholder="Min"
									value={filters.squareFootage?.min}
									onChange={(e) =>
										handleChange("squareFootage", {
											...filters.squareFootage,
											min: e.target.value,
										})
									}
								/>
								<Input
									type="number"
									placeholder="Max"
									value={filters.squareFootage?.max}
									onChange={(e) =>
										handleChange("squareFootage", {
											...filters.squareFootage,
											max: e.target.value,
										})
									}
								/>
							</div>
						</div>

						{/* Amenities */}
						<div className="space-y-2">
							<Label>Amenities</Label>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
								{AMENITIES.map(({ value, label }) => (
									<div key={value} className="flex items-center space-x-2">
										<Checkbox
											id={value}
											checked={filters.amenities?.includes(value)}
											onCheckedChange={() => handleAmenityChange(value)}
										/>
										<label htmlFor={value} className="text-sm text-gray-700">
											{label}
										</label>
									</div>
								))}
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</div>
	)
}
