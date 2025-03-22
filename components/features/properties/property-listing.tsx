"use client"

import { LoadingState } from "@/components/ui/loading-state"
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
import { usePropertyManager } from "@/hooks/properties/use-property-manager"
import { usePropertyPagination } from "@/hooks/properties/use-property-pagination"
import { PropertyFilters } from "@/types"
import { useCallback, useEffect, useState } from "react"
import { PropertyFilters as PropertyFiltersComponent } from "./property-filters"
import { PropertiesGrid } from "./property-grid"
import { PropertyMap } from "./property-map"
import { ViewToggle } from "./view-toggle"

interface PropertyListingProps {
	title?: string
	viewType?: "grid" | "map"
	showFilters?: boolean
	pageSize?: number
	initialFilters?: PropertyFilters
	listingType?: "buy" | "rent"
}

export function PropertyListing({
	title,
	viewType = "grid",
	showFilters = true,
	pageSize = 12,
	initialFilters = {},
	listingType,
}: PropertyListingProps) {
	const { user } = useAuth()
	const [currentView, setCurrentView] = useState<"grid" | "map">(viewType)
	const [filters, setFilters] = useState<PropertyFilters>(initialFilters)

	// Use the property manager hook to handle data fetching and filtering
	const { properties, isLoading, isError } = usePropertyManager({
		...filters,
		listingType,
	})

	// Use pagination hook with the properties from the manager
	const {
		pagination,
		paginatedItems,
		goToPage,
		goToNextPage,
		goToPreviousPage,
		getPageNumbers,
		resetPagination,
	} = usePropertyPagination({
		items: properties || [],
		defaultItemsPerPage: pageSize,
	})

	const handleFiltersChange = useCallback((newFilters: PropertyFilters) => {
		setFilters(newFilters)
	}, [])

	// Reset pagination when filters or properties change
	useEffect(() => {
		resetPagination()
	}, [filters, properties, resetPagination])

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

			{isLoading ? (
				<div className="flex justify-center py-12">
					<LoadingState type="properties" />
				</div>
			) : isError ? (
				<div className="text-center py-8">
					<p className="text-red-500">
						Error loading properties. Please try again later.
					</p>
				</div>
			) : properties && properties.length > 0 ? (
				<div>
					{currentView === "grid" ? (
						<div className="space-y-8">
							<PropertiesGrid properties={paginatedItems} />

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
													className="cursor-pointer"
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
						</div>
					) : (
						<PropertyMap properties={properties} />
					)}
				</div>
			) : (
				<div className="text-center py-8">
					<p className="text-gray-500">No properties match your filters</p>
				</div>
			)}
		</div>
	)
}
