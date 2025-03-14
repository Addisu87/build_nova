"use client"

import { useState } from "react"
import {
	Button,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Checkbox,
} from "@/components/ui"
import { motion } from "framer-motion"
import {
	PropertyFilters as PropertyFiltersType,
	PROPERTY_TYPES,
	AMENITIES,
	SORT_OPTIONS,
	PropertyType,
} from "@/types/properties"

interface PropertyFiltersProps {
	filters: PropertyFiltersType
	onChange: (
		filters: Partial<PropertyFiltersType>,
	) => void
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
	const [isAdvancedOpen, setIsAdvancedOpen] =
		useState(false)

	const handleChange = (
		field: keyof PropertyFiltersType,
		value: any,
	) => {
		onChange({ [field]: value })
	}

	const handleAmenityChange = (
		amenity: string,
	) => {
		const currentAmenities =
			filters.amenities || []
		const newAmenities =
			currentAmenities.includes(amenity)
				? currentAmenities.filter(
						(a) => a !== amenity,
				  )
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
			sortBy: "date_desc",
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
							onChange={(e) =>
								handleChange(
									"minPrice",
									e.target.value,
								)
							}
							className="w-full"
						/>
						<Input
							type="number"
							placeholder="Max"
							value={filters.maxPrice}
							onChange={(e) =>
								handleChange(
									"maxPrice",
									e.target.value,
								)
							}
							className="w-full"
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
							<SelectItem value="any">
								Any
							</SelectItem>
							{[1, 2, 3, 4, 5].map((num) => (
								<SelectItem
									key={num}
									value={num.toString()}
								>
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
							handleChange("propertyType", 
								value === "any" ? "" : value as PropertyType
							)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Any" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="any">
								Any
							</SelectItem>
							{Object.entries(PROPERTY_TYPES).map(
								([value, label]) => (
									<SelectItem
										key={value}
										value={value}
									>
										{label}
									</SelectItem>
								),
							)}
						</SelectContent>
					</Select>
				</div>

				{/* Sort By */}
				<div className="space-y-2">
					<Label>Sort By</Label>
					<Select
						value={sort}
						onValueChange={(value) =>
							onSortChange(value as SortOption)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Sort by..." />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(SORT_OPTIONS).map(
								([value, label]) => (
									<SelectItem
										key={value}
										value={value}
									>
										{label}
									</SelectItem>
								),
							)}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Advanced Filters Toggle */}
			<div className="flex justify-between items-center">
				<Button
					variant="outline"
					onClick={() =>
						setIsAdvancedOpen(!isAdvancedOpen)
					}
				>
					{isAdvancedOpen
						? "Less Filters"
						: "More Filters"}
				</Button>
				<Button
					variant="ghost"
					onClick={handleReset}
				>
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
									value={
										filters.squareFootage?.min
									}
									onChange={(e) =>
										handleChange(
											"squareFootage",
											{
												...filters.squareFootage,
												min: e.target.value,
											},
										)
									}
								/>
								<Input
									type="number"
									placeholder="Max"
									value={
										filters.squareFootage?.max
									}
									onChange={(e) =>
										handleChange(
											"squareFootage",
											{
												...filters.squareFootage,
												max: e.target.value,
											},
										)
									}
								/>
							</div>
						</div>

						{/* Year Built */}
						<div className="space-y-2">
							<Label>Year Built</Label>
							<div className="flex space-x-2">
								<Input
									type="number"
									placeholder="Min"
									value={filters.yearBuilt?.min}
									onChange={(e) =>
										handleChange("yearBuilt", {
											...filters.yearBuilt,
											min: e.target.value,
										})
									}
								/>
								<Input
									type="number"
									placeholder="Max"
									value={filters.yearBuilt?.max}
									onChange={(e) =>
										handleChange("yearBuilt", {
											...filters.yearBuilt,
											max: e.target.value,
										})
									}
								/>
							</div>
						</div>
					</div>

					{/* Amenities */}
					<div className="space-y-2">
						<Label>Amenities</Label>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
							{AMENITIES.map(
								({ value, label }) => (
									<div
										key={value}
										className="flex items-center space-x-2"
									>
										<Checkbox
											id={value}
											checked={filters.amenities?.includes(
												value,
											)}
											onCheckedChange={() =>
												handleAmenityChange(value)
											}
										/>
										<label
											htmlFor={value}
											className="text-sm text-gray-700"
										>
											{label}
										</label>
									</div>
								),
							)}
						</div>
					</div>
				</motion.div>
			)}
		</div>
	)
}
