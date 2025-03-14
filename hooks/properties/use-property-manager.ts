import { useState } from "react"
import { mockProperties } from "@/components/features/properties/mock-data"
import type { Property, PropertyFilters, SortOption } from "@/types/properties"

export function usePropertyManager(initialProperties: Property[] = []) {
	const [state, setState] = useState({
		properties: initialProperties.length > 0 ? initialProperties : mockProperties,
		filters: {
			minPrice: "",
			maxPrice: "",
			bedrooms: "",
			bathrooms: "",
			propertyType: "",
			location: "",
			amenities: [],
			squareFootage: { min: "", max: "" },
			yearBuilt: { min: "", max: "" },
			sortBy: "date_desc" as SortOption,
		} as PropertyFilters,
	})

	// Remove isLoading since we'll use auth context's isLoading

	const updateFilters = (newFilters: Partial<PropertyFilters>) => {
		setState(prev => ({
			...prev,
			filters: {
				...prev.filters,
				...newFilters,
			},
		}))
	}

	const updateSort = (sortBy: SortOption) => {
		updateFilters({ sortBy })
	}

	// Apply filters and sorting to properties
	const filteredAndSortedProperties = applyFiltersAndSort(state.properties, state.filters)

	return {
		properties: filteredAndSortedProperties,
		filters: state.filters,
		updateFilters,
		updateSort,
		sortBy: state.filters.sortBy,
	}
}

// Helper function to apply filters and sorting
function applyFiltersAndSort(properties: Property[], filters: PropertyFilters) {
	let filtered = [...properties]

	// Apply filters
	if (filters.minPrice) {
		filtered = filtered.filter(p => p.price >= parseInt(filters.minPrice))
	}
	if (filters.maxPrice) {
		filtered = filtered.filter(p => p.price <= parseInt(filters.maxPrice))
	}
	if (filters.bedrooms) {
		filtered = filtered.filter(p => p.bedrooms >= parseInt(filters.bedrooms))
	}
	if (filters.bathrooms) {
		filtered = filtered.filter(p => p.bathrooms >= parseInt(filters.bathrooms))
	}
	if (filters.propertyType) {
		filtered = filtered.filter(p => p.type === filters.propertyType)
	}
	if (filters.location) {
		filtered = filtered.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()))
	}

	// Apply sorting
	filtered.sort((a, b) => {
		switch (filters.sortBy) {
			case "price_asc":
				return a.price - b.price
			case "price_desc":
				return b.price - a.price
			case "date_desc":
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			case "date_asc":
				return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			default:
				return 0
		}
	})

	return filtered
}
