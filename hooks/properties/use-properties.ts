import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query"
import {
	supabase,
	Property,
	NewProperty,
	PropertyUpdate,
} from "@/lib/supabase"

import { PropertyFilters as BasePropertyFilters, PropertyStatus } from "@/types/properties"

// Define a specialized interface for API parameters
interface PropertyApiFilters {
	minPrice?: number
	maxPrice?: number
	bedrooms?: number
	bathrooms?: number
	propertyType?: string
	location?: string
	status?: PropertyStatus[]
}

export function useProperties(
	filters: PropertyFilters = {},
) {
	return useQuery({
		queryKey: ["properties", filters],
		queryFn: async () => {
			let query = supabase
				.from("properties")
				.select("*")

			if (filters.minPrice) {
				query = query.gte(
					"price",
					filters.minPrice,
				)
			}
			if (filters.maxPrice) {
				query = query.lte(
					"price",
					filters.maxPrice,
				)
			}
			if (filters.bedrooms) {
				query = query.eq(
					"bedrooms",
					filters.bedrooms,
				)
			}
			if (filters.bathrooms) {
				query = query.eq(
					"bathrooms",
					filters.bathrooms,
				)
			}
			if (filters.city) {
				query = query.ilike("city", filters.city)
			}
			if (filters.state) {
				query = query.ilike(
					"state",
					filters.state,
				)
			}
			if (filters.status) {
				query = query.eq("status", filters.status)
			}

			const { data, error } = await query.order(
				"created_at",
				{ ascending: false },
			)

			if (error) throw error
			return data as Property[]
		},
	})
}

export function useProperty(id: string) {
	return useQuery({
		queryKey: ["property", id],
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

export function useCreateProperty() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (
			newProperty: NewProperty,
		) => {
			const { data, error } = await supabase
				.from("properties")
				.insert(newProperty)
				.select()
				.single()

			if (error) throw error
			return data as Property
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["properties"],
			})
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
			updates: PropertyUpdate
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
			queryClient.invalidateQueries({
				queryKey: ["properties"],
			})
			queryClient.invalidateQueries({
				queryKey: ["property", data.id],
			})
		},
	})
}

export function useDeleteProperty() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (id: string) => {
			const { error } = await supabase
				.from("properties")
				.delete()
				.eq("id", id)
			if (error) throw error
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["properties"],
			})
		},
	})
}
