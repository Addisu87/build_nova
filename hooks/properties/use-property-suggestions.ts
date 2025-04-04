import { supabase } from "@/lib/supabase/client"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { useDebounce } from "./use-debounce"

interface Suggestion {
	id: string
	text: string
	type: "location" | "property_type" | "feature" | "amenity"
	count: number
}

interface SuggestionCache {
	[key: string]: {
		suggestions: Suggestion[]
		timestamp: number
	}
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const MIN_QUERY_LENGTH = 2
const MAX_SUGGESTIONS = 5

export function usePropertySuggestions() {
	const [query, setQuery] = useState("")
	const [suggestions, setSuggestions] = useState<Suggestion[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [cache, setCache] = useState<SuggestionCache>({})
	const debouncedQuery = useDebounce(query, 300)

	const fetchSuggestions = useCallback(
		async (searchQuery: string) => {
			if (searchQuery.length < MIN_QUERY_LENGTH) {
				setSuggestions([])
				return
			}

			// Check cache first
			const cached = cache[searchQuery]
			if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
				setSuggestions(cached.suggestions)
				return
			}

			try {
				setIsLoading(true)

				// Fetch location suggestions
				const { data: locations, error: locationError } = await supabase
					.from("locations")
					.select("*")
					.ilike("name", `%${searchQuery}%`)
					.limit(MAX_SUGGESTIONS)

				if (locationError) {
					throw locationError
				}

				// Fetch property type suggestions
				const { data: propertyTypes, error: propertyTypeError } = await supabase
					.from("property_types")
					.select("*")
					.ilike("name", `%${searchQuery}%`)
					.limit(MAX_SUGGESTIONS)

				if (propertyTypeError) {
					throw propertyTypeError
				}

				// Fetch feature suggestions
				const { data: features, error: featureError } = await supabase
					.from("features")
					.select("*")
					.ilike("name", `%${searchQuery}%`)
					.limit(MAX_SUGGESTIONS)

				if (featureError) {
					throw featureError
				}

				// Fetch amenity suggestions
				const { data: amenities, error: amenityError } = await supabase
					.from("amenities")
					.select("*")
					.ilike("name", `%${searchQuery}%`)
					.limit(MAX_SUGGESTIONS)

				if (amenityError) {
					throw amenityError
				}

				// Combine and format suggestions
				const formattedSuggestions: Suggestion[] = [
					...(locations || []).map((loc) => ({
						id: loc.id,
						text: loc.name,
						type: "location" as const,
						count: loc.property_count || 0,
					})),
					...(propertyTypes || []).map((type) => ({
						id: type.id,
						text: type.name,
						type: "property_type" as const,
						count: type.property_count || 0,
					})),
					...(features || []).map((feature) => ({
						id: feature.id,
						text: feature.name,
						type: "feature" as const,
						count: feature.property_count || 0,
					})),
					...(amenities || []).map((amenity) => ({
						id: amenity.id,
						text: amenity.name,
						type: "amenity" as const,
						count: amenity.property_count || 0,
					})),
				]

				// Sort by count and limit total suggestions
				const sortedSuggestions = formattedSuggestions
					.sort((a, b) => b.count - a.count)
					.slice(0, MAX_SUGGESTIONS)

				// Update cache
				setCache((prev) => ({
					...prev,
					[searchQuery]: {
						suggestions: sortedSuggestions,
						timestamp: Date.now(),
					},
				}))

				setSuggestions(sortedSuggestions)
			} catch (err) {
				console.error("Failed to fetch suggestions:", err)
				toast.error("Failed to load suggestions")
			} finally {
				setIsLoading(false)
			}
		},
		[cache],
	)

	useEffect(() => {
		fetchSuggestions(debouncedQuery)
	}, [debouncedQuery, fetchSuggestions])

	const clearSuggestions = () => {
		setSuggestions([])
		setQuery("")
	}

	const getSuggestionsByType = (type: Suggestion["type"]) => {
		return suggestions.filter((suggestion) => suggestion.type === type)
	}

	const getTopSuggestions = (limit: number = MAX_SUGGESTIONS) => {
		return suggestions.slice(0, limit)
	}

	const getPopularSuggestions = () => {
		return suggestions.sort((a, b) => b.count - a.count).slice(0, MAX_SUGGESTIONS)
	}

	return {
		query,
		setQuery,
		suggestions,
		isLoading,
		clearSuggestions,
		getSuggestionsByType,
		getTopSuggestions,
		getPopularSuggestions,
	}
}
