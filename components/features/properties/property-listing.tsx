"use client"

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import { useAuth } from "@/contexts/auth-context"
import { usePropertyPagination } from "@/hooks/properties/use-property-pagination"
import { mockProperties } from "@/mock-data/properties"
import { PropertyFilters } from "@/types"
import { useEffect, useState } from "react"
import { PropertyFilters as PropertyFiltersComponent } from "./property-filters"
import { PropertiesGrid } from "./property-grid"
import { PropertyMap } from "./property-map"
import { ViewToggle } from "./view-toggle"

interface PropertyListingProps {
	title?: string
	viewType?: "grid" | "map"
	showFilters?: boolean
	pageSize?: number
}

export function PropertyListing({
	title,
	viewType = "grid",
	showFilters = true,
	pageSize = 12,
}: PropertyListingProps) {
	const { user } = useAuth()
	const [currentView, setCurrentView] = useState<"grid" | "map">(viewType)
	const [properties] = useState(mockProperties)
	const [filteredProperties, setFilteredProperties] = useState(properties)
	const [filters, setFilters] = useState<PropertyFilters>({})

	const {
		pagination,
		paginatedItems,
		goToPage,
		goToNextPage,
		goToPreviousPage,
		getPageNumbers,
		resetPagination,
	} = usePropertyPagination({
		items: filteredProperties,
		defaultItemsPerPage: pageSize,
	})

	const applyFilters = (filters: PropertyFilters) => {
		let filtered = [...properties]

		if (filters.minPrice) {
			filtered = filtered.filter((property) => property.price >= filters.minPrice!)
		}

		if (filters.maxPrice) {
			filtered = filtered.filter((property) => property.price <= filters.maxPrice!)
		}

		if (filters.bedrooms) {
			filtered = filtered.filter((property) => property.bedrooms >= filters.bedrooms!)
		}

		if (filters.bathrooms) {
			filtered = filtered.filter((property) => property.bathrooms >= filters.bathrooms!)
		}

		if (filters.property_type) {
			filtered = filtered.filter(
				(property) => property.property_type === filters.property_type,
			)
		}

		if (filters.location) {
			const searchTerm = filters.location.toLowerCase()
			filtered = filtered.filter(
				(property) =>
					property.city?.toLowerCase().includes(searchTerm) ||
					property.state?.toLowerCase().includes(searchTerm) ||
					property.zip_code?.toLowerCase().includes(searchTerm),
			)
		}

		setFilteredProperties(filtered)
		resetPagination()
	}

	const handleFiltersChange = (newFilters: PropertyFilters) => {
		setFilters(newFilters)
		applyFilters(newFilters)
	}

	// Initial filter application
	useEffect(() => {
		applyFilters(filters)
	}, [])

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				{title && <h2 className="text-2xl font-bold">{title}</h2>}

				<div className="flex items-center gap-4">
					{showFilters && (
						<PropertyFiltersComponent
							onFiltersChange={handleFiltersChange}
							initialFilters={filters}
						/>
					)}
					<ViewToggle view={currentView} onChange={setCurrentView} />
				</div>
			</div>

			<div>
				{currentView === "grid" ? (
					<div className="space-y-8">
						<PropertiesGrid properties={paginatedItems} />

						{filteredProperties.length > 0 && (
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											onClick={goToPreviousPage}
											className={
												pagination.currentPage === 1
													? "pointer-events-none opacity-50"
													: "cursor-pointer"
											}
										/>
									</PaginationItem>

									{getPageNumbers().map((page, index) =>
										page === "..." ? (
											<PaginationItem key={`ellipsis-${index}`}>
												<PaginationEllipsis />
											</PaginationItem>
										) : (
											<PaginationItem key={page}>
												<PaginationLink
													onClick={() => goToPage(page as number)}
													isActive={pagination.currentPage === page}
												>
													{page}
												</PaginationLink>
											</PaginationItem>
										),
									)}

									<PaginationItem>
										<PaginationNext
											onClick={goToNextPage}
											className={
												pagination.currentPage === pagination.totalPages
													? "pointer-events-none opacity-50"
													: "cursor-pointer"
											}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						)}

						{filteredProperties.length === 0 && (
							<div className="text-center py-8">
								<p className="text-gray-500">No properties match your filters</p>
							</div>
						)}
					</div>
				) : (
					<PropertyMap properties={filteredProperties} />
				)}
			</div>
		</div>
	)
}
