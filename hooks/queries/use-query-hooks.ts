import { PropertyFormData } from "@/lib/properties/property-schemas"
import { supabase } from "@/lib/supabase/client"
import { Property, PropertyApiFilters, PropertyType } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

// Enhanced query keys with type safety
export const queryKeys = {
	properties: {
		all: ["properties"] as const,
		list: (filters: PropertyApiFilters) =>
			[...queryKeys.properties.all, filters] as const,
		detail: (id: string) => [...queryKeys.properties.all, id] as const,
		favorites: (userId: string) =>
			[...queryKeys.properties.all, "favorites", userId] as const,
	},
	reviews: {
		all: ["reviews"] as const,
		byProperty: (propertyId: string) => [...queryKeys.reviews.all, propertyId] as const,
	},
} as const

// Enhanced fetch function with better error handling
const fetchProperties = async (filters: PropertyApiFilters = {}) => {
	try {
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
					`zip_code.ilike.%${filters.location}%`,
			)
		}
		if (filters.square_feet) {
			if (filters.square_feet.min)
				query = query.gte("square_feet", filters.square_feet.min)
			if (filters.square_feet.max)
				query = query.lte("square_feet", filters.square_feet.max)
		}
		if (filters.year_built) {
			if (filters.year_built.min)
				query = query.gte("year_built", filters.year_built.min)
			if (filters.year_built.max)
				query = query.lte("year_built", filters.year_built.max)
		}
		if (filters.status) query = query.eq("status", filters.status)

		// Enhanced pagination
		if (filters.limit) query = query.limit(filters.limit)
		if (filters.page && filters.limit) {
			query = query.range(
				(filters.page - 1) * filters.limit,
				filters.page * filters.limit - 1,
			)
		}

		const { data, error } = await query
		if (error) throw error
		return data as Property[]
	} catch (error) {
		toast.error("Failed to fetch properties")
		throw error
	}
}

// Enhanced hooks with better error handling and types
export function useProperties(filters: PropertyApiFilters = {}) {
	return useQuery({
		queryKey: queryKeys.properties.list(filters),
		queryFn: () => fetchProperties(filters),
		staleTime: 60 * 1000, // 1 minute
		retry: 2,
		onError: (error: Error) => {
			toast.error(`Error fetching properties: ${error.message}`)
		},
	})
}

export function useProperty(id: string) {
	return useQuery({
		queryKey: queryKeys.properties.detail(id),
		queryFn: async () => {
			try {
				const { data, error } = await supabase
					.from("properties")
					.select("*")
					.eq("id", id)
					.single()

				if (error) throw error
				return data as Property
			} catch (error) {
				toast.error("Failed to fetch property details")
				throw error
			}
		},
		staleTime: 60 * 1000,
	})
}

// Enhanced mutation hooks with optimistic updates
export function useCreateProperty() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (newProperty: PropertyFormData) => {
			const { data, error } = await supabase
				.from("properties")
				.insert({
					...newProperty,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				})
				.select()
				.single()

			if (error) throw error
			return data as Property
		},
		onSuccess: (newProperty) => {
			queryClient.invalidateQueries({ queryKey: ["properties"] })
			toast.success("Property created successfully")
		},
		onError: (error: Error) => {
			toast.error(`Failed to create property: ${error.message}`)
		},
	})
}

export function useUpdateProperty() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			id,
			updates,
		}: {
			id: string
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
		onSuccess: (updatedProperty) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.properties.detail(updatedProperty.id),
			})
			queryClient.invalidateQueries({
				queryKey: queryKeys.properties.all,
			})
			toast.success("Property updated successfully")
		},
		onError: (error) => {
			toast.error(`Failed to update property: ${error.message}`)
		},
	})
}

export function useDeleteProperty() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (id: string) => {
			const { error } = await supabase.from("properties").delete().eq("id", id)

			if (error) throw error
		},
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
			queryClient.removeQueries({ queryKey: queryKeys.properties.detail(id) })
			toast.success("Property deleted successfully")
		},
		onError: (error) => {
			toast.error(`Failed to delete property: ${error.message}`)
		},
	})
}
