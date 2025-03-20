import { PropertyFilters as BasePropertyFilters } from "@/types"

// Re-export the PropertyFilters interface from types/properties.ts
// This ensures all components importing from this file get the same interface
export type PropertyFilters = BasePropertyFilters

// Helper function to convert string filter values to appropriate types for API calls
export function convertFiltersToApiParams(filters: PropertyFilters) {
	return {
		minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
		maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
		bedrooms: filters.bedrooms ? Number(filters.bedrooms) : undefined,
		bathrooms: filters.bathrooms ? Number(filters.bathrooms) : undefined,
		propertyType: filters.propertyType || undefined,
		location: filters.location || undefined,
		status: filters.status || undefined,
	}
}

// Helper function to check if filters are empty
export function areFiltersEmpty(filters: Partial<PropertyFilters>): boolean {
	return (
		!filters.minPrice &&
		!filters.maxPrice &&
		!filters.bedrooms &&
		!filters.bathrooms &&
		!filters.propertyType &&
		!filters.location &&
		!filters.status
	)
}

// Helper function to create empty filters
export function createEmptyFilters(): PropertyFilters {
	return {
		minPrice: "",
		maxPrice: "",
		bedrooms: "",
		bathrooms: "",
		propertyType: "",
		location: "",
	}
}
