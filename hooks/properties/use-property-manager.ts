import { useState, useMemo } from "react"
import { mockProperties } from "@/components/features/properties/mock-data"
import type { Property, PropertyFilters, SortOption } from "@/types/properties"

export function usePropertyManager(
	initialProperties: Property[] = [],
	initialSearchQuery: string = ""
) {
	const [state, setState] = useState({
		properties: initialProperties.length > 0 ? initialProperties : mockProperties,
		filters: {
			searchQuery: initialSearchQuery,
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

	const filteredProperties = useMemo(() => {
		let filtered = [...state.properties]

		// Apply search query filter
		if (state.filters.searchQuery) {
			filtered = filtered.filter(property => 
				property.title.toLowerCase().includes(state.filters.searchQuery.toLowerCase()) ||
				property.description?.toLowerCase().includes(state.filters.searchQuery.toLowerCase())
			)
		}

		// Apply other filters
		if (state.filters.minPrice) {
			filtered = filtered.filter(p => p.price >= Number(state.filters.minPrice))
		}
		if (state.filters.maxPrice) {
			filtered = filtered.filter(p => p.price <= Number(state.filters.maxPrice))
		}
		if (state.filters.bedrooms) {
			filtered = filtered.filter(p => p.bedrooms >= Number(state.filters.bedrooms))
		}
		if (state.filters.bathrooms) {
			filtered = filtered.filter(p => p.bathrooms >= Number(state.filters.bathrooms))
		}
		if (state.filters.propertyType) {
			filtered = filtered.filter(p => p.propertyType.toLowerCase() === state.filters.propertyType)
		}
		if (state.filters.location) {
			filtered = filtered.filter(p => p.location.toLowerCase().includes(state.filters.location.toLowerCase()))
		}

		// Apply sorting
		filtered.sort((a, b) => {
			switch (state.filters.sortBy) {
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
	}, [state.properties, state.filters])

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

	return {
		properties: filteredProperties,
		filters: state.filters,
		updateFilters,
		updateSort,
		sortBy: state.filters.sortBy,
	}
}
