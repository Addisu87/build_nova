import { supabase } from "@/lib/supabase/client"
import { PropertyFilters } from "@/types"
import { Database } from "@/types/supabase"
import { useQuery } from "@tanstack/react-query"

type Property = Database["public"]["Tables"]["properties"]["Row"]

export function useProperties(filters: PropertyFilters = {}) {
	return useQuery({
		queryKey: ["properties", filters],
		queryFn: async () => {
			let query = supabase.from("properties").select("*")

			if (filters.min_price) {
				query = query.gte("price", filters.min_price)
			}
			if (filters.max_price) {
				query = query.lte("price", filters.max_price)
			}
			if (filters.bedrooms) {
				query = query.eq("bedrooms", filters.bedrooms)
			}
			if (filters.bathrooms) {
				query = query.eq("bathrooms", filters.bathrooms)
			}
			if (filters.property_type) {
				query = query.eq("property_type", filters.property_type)
			}
			if (filters.location) {
				query = query.or(
					`city.ilike.%${filters.location}%,` +
						`state.ilike.%${filters.location}%,` +
						`zip_code.ilike.%${filters.location}%`,
				)
			}
			if (filters.status) {
				query = query.eq("status", filters.status)
			}
			if (filters.min_square_feet) {
				query = query.gte("square_feet", filters.min_square_feet)
			}
			if (filters.max_square_feet) {
				query = query.lte("square_feet", filters.max_square_feet)
			}
			if (filters.year_built) {
				query = query.eq("year_built", filters.year_built)
			}
			if (filters.lot_size?.min) {
				query = query.gte("lot_size", filters.lot_size.min)
			}
			if (filters.lot_size?.max) {
				query = query.lte("lot_size", filters.lot_size.max)
			}

			const { data, error } = await query

			if (error) throw error
			return data
		},
	})
}
