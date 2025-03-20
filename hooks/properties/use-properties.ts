import { Database } from "@/types/supabase"
import { PropertyFilters } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase/client"

type Property = Database["public"]["Tables"]["properties"]["Row"]

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select("*")

      if (filters.minPrice) {
        query = query.gte("price", filters.minPrice)
      }
      if (filters.maxPrice) {
        query = query.lte("price", filters.maxPrice)
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
          `zip_code.ilike.%${filters.location}%`
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

      const { data, error } = await query

      if (error) throw error
      return data
    }
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


