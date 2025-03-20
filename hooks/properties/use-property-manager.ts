import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { PropertyFilters } from '@/types/properties'

export function usePropertyManager(initialFilters?: PropertyFilters) {
	const [filters, setFilters] = useState<PropertyFilters>(initialFilters || {})

	const { data: properties, isLoading } = useQuery({
		queryKey: ['properties', filters],
		queryFn: async () => {
			let query = supabase
				.from('properties')
				.select('*')

			if (filters.minPrice) {
				query = query.gte('price', filters.minPrice)
			}
			if (filters.maxPrice) {
				query = query.lte('price', filters.maxPrice)
			}
			if (filters.property_type) {
				query = query.eq('property_type', filters.property_type)
			}
			if (filters.status) {
				query = query.eq('status', filters.status)
			}
			if (filters.bedrooms) {
				query = query.gte('bedrooms', filters.bedrooms)
			}
			if (filters.bathrooms) {
				query = query.gte('bathrooms', filters.bathrooms)
			}
			if (filters.searchQuery) {
				query = query.or(`title.ilike.%${filters.searchQuery}%,address.ilike.%${filters.searchQuery}%`)
			}

			const { data, error } = await query

			if (error) throw error
			return data
		}
	})

	const updateFilters = useCallback((newFilters: Partial<PropertyFilters>) => {
		setFilters(prev => ({ ...prev, ...newFilters }))
	}, [])

	return {
		properties,
		isLoading,
		filters,
		updateFilters
	}
}
