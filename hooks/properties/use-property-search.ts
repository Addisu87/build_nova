import { useState, useEffect } from "react"
import {
	useRouter,
	useSearchParams,
} from "next/navigation"
import { toast } from "react-hot-toast"
import { Database } from "@/types/supabase"
import { getProperties } from "@/lib/supabase/db"

type Property =
	Database["public"]["Tables"]["properties"]["Row"]

interface SearchFilters {
	minPrice?: number
	maxPrice?: number
	bedrooms?: number
	bathrooms?: number
	propertyType?: string
	location?: string
}

export function usePropertySearch() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [properties, setProperties] = useState<
		Property[]
	>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] =
		useState<Error | null>(null)
	const [filters, setFilters] =
		useState<SearchFilters>({})

	useEffect(() => {
		// Parse search params into filters
		const newFilters: SearchFilters = {}

		const minPrice = searchParams.get("minPrice")
		if (minPrice)
			newFilters.minPrice = parseInt(minPrice)

		const maxPrice = searchParams.get("maxPrice")
		if (maxPrice)
			newFilters.maxPrice = parseInt(maxPrice)

		const bedrooms = searchParams.get("bedrooms")
		if (bedrooms)
			newFilters.bedrooms = parseInt(bedrooms)

		const bathrooms =
			searchParams.get("bathrooms")
		if (bathrooms)
			newFilters.bathrooms = parseInt(bathrooms)

		const propertyType = searchParams.get(
			"propertyType",
		)
		if (propertyType)
			newFilters.propertyType = propertyType

		const location = searchParams.get("location")
		if (location) newFilters.location = location

		setFilters(newFilters)
	}, [searchParams])

	useEffect(() => {
		async function fetchProperties() {
			try {
				setIsLoading(true)
				const data = await getProperties(filters)
				setProperties(data)
			} catch (err) {
				setError(
					err instanceof Error
						? err
						: new Error(
								"Failed to fetch properties",
						  ),
				)
				toast.error("Failed to load properties")
			} finally {
				setIsLoading(false)
			}
		}

		fetchProperties()
	}, [filters])

	const updateFilters = (
		newFilters: Partial<SearchFilters>,
	) => {
		const updatedFilters = {
			...filters,
			...newFilters,
		}
		const params = new URLSearchParams()

		if (updatedFilters.minPrice)
			params.set(
				"minPrice",
				updatedFilters.minPrice.toString(),
			)
		if (updatedFilters.maxPrice)
			params.set(
				"maxPrice",
				updatedFilters.maxPrice.toString(),
			)
		if (updatedFilters.bedrooms)
			params.set(
				"bedrooms",
				updatedFilters.bedrooms.toString(),
			)
		if (updatedFilters.bathrooms)
			params.set(
				"bathrooms",
				updatedFilters.bathrooms.toString(),
			)
		if (updatedFilters.propertyType)
			params.set(
				"propertyType",
				updatedFilters.propertyType,
			)
		if (updatedFilters.location)
			params.set(
				"location",
				updatedFilters.location,
			)

		const queryString = params.toString()
		router.push(
			queryString ? `?${queryString}` : "/",
		)
	}

	const clearFilters = () => {
		router.push("/")
	}

	return {
		properties,
		isLoading,
		error,
		filters,
		updateFilters,
		clearFilters,
	}
}
