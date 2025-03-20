import { supabase } from "@/lib/supabase/client"
import { Property, PropertyFilters, PropertyApiFilters, PropertyType } from "@/types"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Base query keys
export const queryKeys = {
	properties: "properties" as const,
	property: "property" as const,
	favorites: "favorites" as const,
}

// Reusable query function
const fetchProperties = async (filters: PropertyApiFilters = {}) => {
	let query = supabase.from("properties").select("*")

	// Type-safe filter handling
	if (filters.min_price) query = query.gte("price", filters.min_price)
	if (filters.max_price) query = query.lte("price", filters.max_price)
	if (filters.bedrooms) query = query.eq("bedrooms", filters.bedrooms)
	if (filters.bathrooms) query = query.eq("bathrooms", filters.bathrooms)
	if (filters.property_type) {
		query = query.eq("property_type", filters.property_type as PropertyType)
	}
	if (filters.location) {
		query = query.or(
			`city.ilike.%${filters.location}%,` +
			`state.ilike.%${filters.location}%,` +
			`zip_code.ilike.%${filters.location}%`
		)
	}
	if (filters.square_feet) {
		if (filters.square_feet.min) query = query.gte("square_feet", filters.square_feet.min)
		if (filters.square_feet.max) query = query.lte("square_feet", filters.square_feet.max)
	}
	if (filters.year_built) {
		if (filters.year_built.min) query = query.gte("year_built", filters.year_built.min)
		if (filters.year_built.max) query = query.lte("year_built", filters.year_built.max)
	}
	if (filters.status) query = query.eq("status", filters.status)

	// Pagination
	if (filters.limit) query = query.limit(filters.limit)
	if (filters.page && filters.limit) {
		query = query.range(
			(filters.page - 1) * filters.limit,
			filters.page * filters.limit - 1
		)
	}

	const { data, error } = await query
	if (error) throw error
	return data as Property[]
}

// Properties hooks
export function useProperties(filters: PropertyApiFilters = {}) {
	return useQuery({
		queryKey: [queryKeys.properties, filters],
		queryFn: () => fetchProperties(filters)
	})
}

export function useProperty(id: string) {
	return useQuery({
		queryKey: [queryKeys.property, id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("properties")
				.select("*")
				.eq("id", id)
				.single()

			if (error) throw error
			return data as Property
		},
	})
}

// Mutation hooks
export function useCreateProperty() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (newProperty: Omit<Property, "id">) => {
			const { data, error } = await supabase
				.from("properties")
				.insert(newProperty)
				.select()
				.single()

			if (error) throw error
			return data as Property
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.properties] })
		},
	})
}

export function useUpdateProperty() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ 
			id, 
			updates 
		}: { 
			id: string; 
			updates: Partial<Omit<Property, "id">> 
		}) => {
			const { data, error } = await supabase
				.from("properties")
				.update(updates)
				.eq("id", id)
				.select()
				.single()

			if (error) throw error
			return data as Property
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.properties] })
			queryClient.invalidateQueries({ queryKey: [queryKeys.property, data.id] })
		},
	})
}
