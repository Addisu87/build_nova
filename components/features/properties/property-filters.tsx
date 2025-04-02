import { Button, Input, Label } from "@/components/ui"
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
import { createEmptyFilters } from "@/hooks/search/use-property-filters"
import { PROPERTY_TYPES, PropertyFilterOptions } from "@/types"
import { SlidersHorizontal } from "lucide-react"
import { useCallback, useState } from "react"

interface PropertyFiltersProps {
	onFiltersChange: (filters: PropertyFilterOptions) => void
	initialFilters?: PropertyFilterOptions
}

export function PropertyFilters({
	onFiltersChange,
	initialFilters,
}: PropertyFiltersProps) {
	const [filters, setFilters] = useState<PropertyFilterOptions>(
		() => initialFilters || createEmptyFilters(),
	)
	const [isOpen, setIsOpen] = useState(false)

	const handleFilterChange = useCallback(
		(key: keyof PropertyFilterOptions, value: any) => {
			setFilters((prev) => {
				const newFilters = { ...prev }
				if (value === "" || value === null || value === undefined) {
					delete newFilters[key]
				} else {
					newFilters[key] = value
				}
				return newFilters
			})
		},
		[],
	)

	const handleReset = useCallback(() => {
		const emptyFilters = createEmptyFilters()
		setFilters(emptyFilters)
		onFiltersChange(emptyFilters)
		setIsOpen(false)
	}, [onFiltersChange])

	const handleApplyFilters = useCallback(() => {
		onFiltersChange(filters)
		setIsOpen(false)
	}, [filters, onFiltersChange])

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button variant="outline" size="sm">
					<SlidersHorizontal className="h-4 w-4 mr-2" />
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
								value={filters.min_price || ""}
								onChange={(e) =>
									handleFilterChange(
										"min_price",
										e.target.value ? Number(e.target.value) : null,
									)
								}
							/>
							<Input
								type="number"
								placeholder="Max"
								value={filters.max_price || ""}
								onChange={(e) =>
									handleFilterChange(
										"max_price",
										e.target.value ? Number(e.target.value) : null,
									)
								}
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
								<SelectItem value="SINGLE_FAMILY_HOME">
									{PROPERTY_TYPES.SINGLE_FAMILY_HOME}
								</SelectItem>
								<SelectItem value="APARTMENT">{PROPERTY_TYPES.APARTMENT}</SelectItem>
								<SelectItem value="CONDO">{PROPERTY_TYPES.CONDO}</SelectItem>
								<SelectItem value="TOWNHOUSE">{PROPERTY_TYPES.TOWNHOUSE}</SelectItem>
								<SelectItem value="STUDIO">{PROPERTY_TYPES.STUDIO}</SelectItem>
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
