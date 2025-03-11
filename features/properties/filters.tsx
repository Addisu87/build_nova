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
} from "@/components/ui"
import { motion } from "framer-motion"

export interface PropertyFilters {
	minPrice: string
	maxPrice: string
	bedrooms: string
	bathrooms: string
	propertyType: string
}

interface PropertyFiltersProps {
	filters: Partial<PropertyFilters>
	onChange: (
		filters: Partial<PropertyFilters>,
	) => void
	className?: string
}

export function PropertyFilters({
	filters,
	onChange,
	className = "",
}: PropertyFiltersProps) {
	const handleChange = (
		key: keyof PropertyFilters,
		value: string,
	) => {
		onChange({ [key]: value })
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 ${className}`}
		>
			<div className="space-y-2">
				<Label>Min Price</Label>
				<Input
					type="number"
					placeholder="Min Price"
					value={filters.minPrice}
					onChange={(e) =>
						handleChange(
							"minPrice",
							e.target.value,
						)
					}
					className="w-full"
				/>
			</div>

			<div className="space-y-2">
				<Label>Max Price</Label>
				<Input
					type="number"
					placeholder="Max Price"
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

			<div className="space-y-2">
				<Label>Bedrooms</Label>
				<Select
					value={filters.bedrooms}
					onValueChange={(value) =>
						handleChange("bedrooms", value)
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Any" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">Any</SelectItem>
						<SelectItem value="1">1+</SelectItem>
						<SelectItem value="2">2+</SelectItem>
						<SelectItem value="3">3+</SelectItem>
						<SelectItem value="4">4+</SelectItem>
						<SelectItem value="5">5+</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2">
				<Label>Bathrooms</Label>
				<Select
					value={filters.bathrooms}
					onValueChange={(value) =>
						handleChange("bathrooms", value)
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Any" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">Any</SelectItem>
						<SelectItem value="1">1+</SelectItem>
						<SelectItem value="2">2+</SelectItem>
						<SelectItem value="3">3+</SelectItem>
						<SelectItem value="4">4+</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2">
				<Label>Property Type</Label>
				<Select
					value={filters.propertyType}
					onValueChange={(value) =>
						handleChange("propertyType", value)
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Any" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">Any</SelectItem>
						<SelectItem value="house">
							House
						</SelectItem>
						<SelectItem value="apartment">
							Apartment
						</SelectItem>
						<SelectItem value="condo">
							Condo
						</SelectItem>
						<SelectItem value="townhouse">
							Townhouse
						</SelectItem>
						<SelectItem value="land">
							Land
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</motion.div>
	)
}
