import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Database } from '@/types/supabase';
import { getProperties } from '@/lib/supabase/db';

type Property = Database['public']['Tables']['properties']['Row'];

type SortOption = 
  | 'price_asc' 
  | 'price_desc' 
  | 'newest' 
  | 'oldest' 
  | 'beds_asc' 
  | 'beds_desc' 
  | 'baths_asc' 
  | 'baths_desc' 
  | 'sqft_asc' 
  | 'sqft_desc' 
  | 'rating_desc';

const SORT_OPTIONS = {
  price_asc: 'Price: Low to High',
  price_desc: 'Price: High to Low',
  newest: 'Newest First',
  oldest: 'Oldest First',
  beds_asc: 'Bedrooms: Low to High',
  beds_desc: 'Bedrooms: High to Low',
  baths_asc: 'Bathrooms: Low to High',
  baths_desc: 'Bathrooms: High to Low',
  sqft_asc: 'Square Feet: Low to High',
  sqft_desc: 'Square Feet: High to Low',
  rating_desc: 'Highest Rated'
} as const;

export function usePropertyManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [state, setState] = useState({
    properties: [] as Property[],
    isLoading: true,
    error: null as Error | null,
    filters: {
      minPrice: undefined as number | undefined,
      maxPrice: undefined as number | undefined,
      bedrooms: undefined as number | undefined,
      bathrooms: undefined as number | undefined,
      propertyType: undefined as string | undefined,
      location: undefined as string | undefined
    },
    sort: {
      sortBy: 'newest' as SortOption,
      label: SORT_OPTIONS.newest
    }
  });

  useEffect(() => {
    const parseParams = () => {
      const newFilters = { ...state.filters };
      const sortBy = searchParams.get('sortBy') as SortOption;

      // Parse filter parameters
      ['minPrice', 'maxPrice', 'bedrooms', 'bathrooms', 'propertyType', 'location'].forEach(param => {
        const value = searchParams.get(param);
        if (value) {
          newFilters[param as keyof typeof newFilters] = 
            param === 'propertyType' || param === 'location' 
              ? value 
              : Number(value);
        }
      });

      // Validate and set sort
      const validSort = sortBy && SORT_OPTIONS[sortBy] ? sortBy : 'newest';

      setState(prev => ({
        ...prev,
        filters: newFilters,
        sort: {
          sortBy: validSort,
          label: SORT_OPTIONS[validSort]
        }
      }));
    };

    parseParams();
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        const data = await getProperties(state.filters);
        setState(prev => ({ 
          ...prev, 
          properties: data, 
          isLoading: false,
          error: null
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err : new Error('Fetch failed'),
          isLoading: false
        }));
        toast.error('Failed to load properties');
      }
    };

    fetchData();
  }, [state.filters]);

  const updateFilters = (newFilters: Partial<typeof state.filters>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    router.push(params.toString() ? `?${params}` : '/');
  };

  const updateSort = (sortBy: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sortBy);
    router.push(`?${params}`);
  };

  return {
    ...state,
    updateFilters,
    updateSort
  };
}