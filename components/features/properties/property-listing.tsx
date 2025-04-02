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
import { createEmptyFilters } from "@/hooks/search/use-property-filters"
import { Property, PropertyFilterOptions } from "@/types"
import { useCallback, useMemo, useState } from "react"
import { PropertyFilters } from "./property-filters"
import { PropertiesGrid } from "./property-grid"
import { PropertyMap } from "./property-map"
import { ViewToggle } from "./view-toggle"

interface PropertyListingProps {
	title?: string
	viewType?: "grid" | "map"
	showFilters?: boolean
	pageSize?: number
	initialFilters?: PropertyFilterOptions
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
	const [filters, setFilters] = useState<PropertyFilterOptions>(() => ({
		...createEmptyFilters(),
		...initialFilters,
	}))

	const queryParams = useMemo(
		() => ({
			...filters,
			listingType,
		}),
		[filters, listingType],
	)

	const { properties, isLoading, isError } = usePropertyManager(queryParams) as {
		properties: Property[]
		isLoading: boolean
		isError: boolean
	}

	const handleFiltersChange = useCallback((newFilters: PropertyFilterOptions) => {
		setFilters(newFilters)
	}, [])

	const {
		pagination,
		paginatedItems,
		goToPage,
		goToNextPage,
		goToPreviousPage,
		getPageNumbers,
	} = usePropertyPagination({
		items: Array.isArray(properties) ? properties : [],
		defaultItemsPerPage: pageSize,
		resetOnItemsChange: true,
	})

	const renderPagination = () => (
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
	)

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-4">
					{title && <h2 className="text-2xl font-bold">{title}</h2>}
				</div>
				
				<ViewToggle 
					view={currentView} 
					onChange={setCurrentView}
					showFilters={showFilters}
					onFiltersChange={handleFiltersChange}
					initialFilters={filters}
				/>
			</div>

			<div className={`grid grid-cols-1 ${showFilters ? 'lg:grid-cols-4' : ''} gap-6`}>
				<div className={showFilters ? "lg:col-span-4" : "w-full"}>
					{isLoading ? (
						<div className="flex justify-center py-12">
							<LoadingState type="properties" />
						</div>
					) : isError ? (
						<div className="text-center py-8">
							<p className="text-destructive">
								Error loading properties. Please try again later.
							</p>
						</div>
					) : properties?.length ? (
						<div>
							{currentView === "grid" ? (
								<div className="space-y-8">
									<PropertiesGrid properties={paginatedItems} />
									{renderPagination()}
								</div>
							) : (
								<PropertyMap properties={paginatedItems} />
							)}
						</div>
					) : (
						<div className="text-center py-8">
							<p className="text-muted-foreground">No properties found</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
