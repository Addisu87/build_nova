import {
	useCreateProperty,
	useDeleteProperty,
	useProperties,
	useUpdateProperty,
} from "@/hooks/queries/use-query-hooks"
import {
	convertFiltersToApiParams,
	createEmptyFilters,
} from "@/hooks/search/use-property-filters"
import { Property, PropertyFilterOptions } from "@/types"
import { useMemo } from "react"

export function usePropertyManager(
	filters: PropertyFilterOptions = createEmptyFilters(),
) {
	// Convert filters to API format using your existing helper
	const apiFilters = useMemo(() => {
		return convertFiltersToApiParams(filters)
	}, [filters])

	// Use existing hooks from use-query-hooks.ts
	const {
		data: properties,
		isLoading,
		isError,
		error,
		refetch,
	} = useProperties(apiFilters)

	const createProperty = useCreateProperty()
	const updateProperty = useUpdateProperty()
	const deleteProperty = useDeleteProperty()

	return {
		properties: properties as Property[], // explicitly type the return
		isLoading,
		isError,
		error,
		refetch,
		filters: apiFilters,
		createProperty: createProperty.mutateAsync,
		updateProperty: updateProperty.mutateAsync,
		deleteProperty: deleteProperty.mutateAsync,
	}
}
