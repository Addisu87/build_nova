import {
	useCreateProperty,
	useDeleteProperty,
	useProperties,
	useUpdateProperty,
} from "@/hooks/queries/use-query-hooks"
import { PropertyApiFilters, PropertyFilters, PropertyStatus } from "@/types"
import { Database } from "@/types/supabase"

type Property = Database["public"]["Tables"]["properties"]["Row"]

export function usePropertyManager(filters: PropertyFilters = {}) {
	// Convert UI filters to API filters using the existing PropertyApiFilters type
	const apiFilters: PropertyApiFilters = {
		min_price: filters?.min_price ?? undefined,
		max_price: filters?.max_price ?? undefined,
		bedrooms: filters?.bedrooms ?? undefined,
		bathrooms: filters?.bathrooms ?? undefined,
		property_type: filters?.property_type ?? undefined,
		location: filters?.location ?? undefined,
		square_feet: {
			min: filters?.min_square_feet?.toString() ?? "",
			max: filters?.max_square_feet?.toString() ?? "",
		},
		year_built: {
			min: filters?.min_year_built?.toString() ?? "",
			max: filters?.max_year_built?.toString() ?? "",
		},
		status: filters?.status as PropertyStatus | undefined,
		page: typeof filters?.page === "number" ? filters.page : undefined,
	}

	// Use existing hooks from use-query-hooks.ts
	const { data: properties, isLoading, isError } = useProperties(apiFilters)

	const createProperty = useCreateProperty()
	const updateProperty = useUpdateProperty()
	const deleteProperty = useDeleteProperty()

	return {
		properties,
		isLoading,
		isError,
		filters,
		createProperty: createProperty.mutateAsync,
		updateProperty: updateProperty.mutateAsync,
		deleteProperty: deleteProperty.mutateAsync,
	}
}
