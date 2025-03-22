import { PropertyFilters as BasePropertyFilters } from "@/types"

// Re-export the PropertyFilters interface from types/properties.ts
// This ensures all components importing from this file get the same interface
export type PropertyFilters = BasePropertyFilters

// Helper function to convert string filter values to appropriate types for API calls
export function convertFiltersToApiParams(
	filters: PropertyFilters,
) {
	return {
		min_price: filters.min_price
			? Number(filters.min_price)
			: undefined,
		max_price: filters.max_price
			? Number(filters.max_price)
			: undefined,
		bedrooms: filters.bedrooms
			? Number(filters.bedrooms)
			: undefined,
		bathrooms: filters.bathrooms
			? Number(filters.bathrooms)
			: undefined,
		property_type:
			filters.property_type || undefined,
		location: filters.location || undefined,
		status: filters.status || undefined,
		square_feet: {
			min:
				filters.min_square_feet?.toString() || "",
			max:
				filters.max_square_feet?.toString() || "",
		},
		year_built: {
			min:
				filters.min_year_built?.toString() || "",
			max:
				filters.max_year_built?.toString() || "",
		},
	}
}

// Helper function to check if filters are empty
export function areFiltersEmpty(
	filters: Partial<PropertyFilters>,
): boolean {
	return (
		!filters.min_price &&
		!filters.max_price &&
		!filters.bedrooms &&
		!filters.bathrooms &&
		!filters.property_type &&
		!filters.location &&
		!filters.status &&
		!filters.min_square_feet &&
		!filters.max_square_feet &&
		!filters.min_year_built &&
		!filters.max_year_built
	)
}

// Helper function to create empty filters
export function createEmptyFilters(): PropertyFilters {
	return {
		min_price: 0,
		max_price: 0,
		bedrooms: 0,
		bathrooms: 0,
		property_type: undefined,
		location: "",
		status: undefined,
		min_square_feet: "",
		max_square_feet: "",
		min_year_built: "",
		max_year_built: "",
	}
}
