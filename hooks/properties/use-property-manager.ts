import { 
  useProperties, 
  useCreateProperty, 
  useUpdateProperty, 
  useDeleteProperty 
} from "@/hooks/queries/use-query-hooks"
import { PropertyFilters, PropertyApiFilters } from "@/types"

export function usePropertyManager(filters: PropertyFilters = {}) {
  // Convert UI filters to API filters
  const apiFilters: PropertyApiFilters = {
    min_price: filters.minPrice,
    max_price: filters.maxPrice,
    bedrooms: filters.bedrooms,
    bathrooms: filters.bathrooms,
    property_type: filters.property_type,
    location: filters.location,
    square_feet: {
      min: filters.min_square_feet,
      max: filters.max_square_feet
    },
    year_built: {
      min: filters.min_year_built,
      max: filters.max_year_built
    },
    status: filters.status,
    limit: filters.limit,
    page: filters.page,
  }

  // Use existing hooks from use-query-hooks
  const { 
    data: properties, 
    isLoading, 
    isError 
  } = useProperties(apiFilters)

  const createProperty = useCreateProperty()
  const updateProperty = useUpdateProperty()
  const deleteProperty = useDeleteProperty()

  return {
    properties,
    isLoading,
    isError,
    filters,
    updateFilters: (newFilters: Partial<PropertyFilters>) => {
      // Handle filter updates here if needed
      // You might want to use a state management solution or URL params
    },
    createProperty: createProperty.mutateAsync,
    updateProperty: updateProperty.mutateAsync,
    deleteProperty: deleteProperty.mutateAsync,
  }
}
