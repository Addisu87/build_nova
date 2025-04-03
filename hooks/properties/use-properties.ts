import { usePropertiesQuery } from "@/hooks/queries/use-query-hooks"
import { convertFiltersToApiParams } from "@/hooks/search/use-property-filters"
import { PropertyFilterOptions } from "@/types"
import { Database } from "@/types/supabase"
import { useMemo } from "react"

type Property = Database["public"]["Tables"]["properties"]["Row"]

export function useProperties(filters: PropertyFilterOptions = {}) {
	// Convert filters to API format
	const apiFilters = useMemo(() => {
		return convertFiltersToApiParams(filters)
	}, [filters])

	// Use the existing query hook that already handles caching, error states, and retries
	return usePropertiesQuery(apiFilters)
}
