import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import type { PropertyFilters } from "@/types/properties"
import { SlidersHorizontal } from "lucide-react"
import { useState } from "react"

interface PropertyFiltersProps {
	onFiltersChange: (filters: PropertyFilters) => void
	initialFilters?: PropertyFilters
}

export function PropertyFilters({
	onFiltersChange,
	initialFilters,
}: PropertyFiltersProps) {
	const [filters, setFilters] = useState<PropertyFilters>(initialFilters || {})
	const [isOpen, setIsOpen] = useState(false)

	const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
		const newFilters = { ...filters, [key]: value }
		setFilters(newFilters)
	}

	const handleApplyFilters = () => {
		onFiltersChange(filters)
		setIsOpen(false)
	}

	const handleReset = () => {
		const newFilters = {}
		setFilters(newFilters)
		onFiltersChange(newFilters)
		setIsOpen(false)
	}

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button variant="outline" size="sm">
					<SlidersHorizontal className="mr-2 h-4 w-4" />
					Filters
				</Button>
			</SheetTrigger>
			<SheetContent className="w-full sm:max-w-md">
				<SheetHeader>
					<SheetTitle>Property Filters</SheetTitle>
				</SheetHeader>

				<div className="mt-6 space-y-6">
					{/* Price Range */}
					<div className="space-y-2">
						<Label>Price Range</Label>
						<div className="grid grid-cols-2 gap-4">
							<Input
								type="number"
								placeholder="Min"
								value={filters.minPrice || ""}
								onChange={(e) => handleFilterChange("minPrice", e.target.value)}
							/>
							<Input
								type="number"
								placeholder="Max"
								value={filters.maxPrice || ""}
								onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
							/>
						</div>
					</div>

					{/* Property Type */}
					<div className="space-y-2">
						<Label>Property Type</Label>
						<Select
							value={filters.property_type}
							onValueChange={(value) => handleFilterChange("property_type", value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="house">House</SelectItem>
								<SelectItem value="apartment">Apartment</SelectItem>
								<SelectItem value="condo">Condo</SelectItem>
								<SelectItem value="townhouse">Townhouse</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Bedrooms */}
					<div className="space-y-2">
						<Label>Minimum Bedrooms</Label>
						<Select
							value={filters.bedrooms?.toString()}
							onValueChange={(value) => handleFilterChange("bedrooms", parseInt(value))}
						>
							<SelectTrigger>
								<SelectValue placeholder="Any" />
							</SelectTrigger>
							<SelectContent>
								{[1, 2, 3, 4, 5].map((num) => (
									<SelectItem key={num} value={num.toString()}>
										{num}+ beds
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Bathrooms */}
					<div className="space-y-2">
						<Label>Minimum Bathrooms</Label>
						<Select
							value={filters.bathrooms?.toString()}
							onValueChange={(value) =>
								handleFilterChange("bathrooms", parseInt(value))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Any" />
							</SelectTrigger>
							<SelectContent>
								{[1, 2, 3, 4].map((num) => (
									<SelectItem key={num} value={num.toString()}>
										{num}+ baths
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex gap-2 pt-6">
						<Button variant="outline" onClick={handleReset} className="flex-1">
							Reset
						</Button>
						<Button onClick={handleApplyFilters} className="flex-1">
							Apply Filters
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}
