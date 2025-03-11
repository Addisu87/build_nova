import { useState, useEffect } from "react"
import {
	useRouter,
	useSearchParams,
} from "next/navigation"
import { toast } from "react-hot-toast"

export interface PropertyFilters {
	minPrice?: number
	maxPrice?: number
	bedrooms?: number
	bathrooms?: number
	propertyType?: string
	location?: string
	sortBy?:
		| "price_asc"
		| "price_desc"
		| "newest"
		| "oldest"
	amenities?: string[]
	features?: string[]
	yearBuilt?: {
		min?: number
		max?: number
	}
	squareFeet?: {
		min?: number
		max?: number
	}
}

const DEFAULT_FILTERS: PropertyFilters = {
	sortBy: "newest",
}

export function usePropertyFilters() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [filters, setFilters] =
		useState<PropertyFilters>(DEFAULT_FILTERS)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		// Parse search params into filters
		const newFilters: PropertyFilters = {
			...DEFAULT_FILTERS,
		}

		// Price range
		const minPrice = searchParams.get("minPrice")
		if (minPrice)
			newFilters.minPrice = parseInt(minPrice)

		const maxPrice = searchParams.get("maxPrice")
		if (maxPrice)
			newFilters.maxPrice = parseInt(maxPrice)

		// Bedrooms and bathrooms
		const bedrooms = searchParams.get("bedrooms")
		if (bedrooms)
			newFilters.bedrooms = parseInt(bedrooms)

		const bathrooms =
			searchParams.get("bathrooms")
		if (bathrooms)
			newFilters.bathrooms = parseInt(bathrooms)

		// Property type and location
		const propertyType = searchParams.get(
			"propertyType",
		)
		if (propertyType)
			newFilters.propertyType = propertyType

		const location = searchParams.get("location")
		if (location) newFilters.location = location

		// Sort by
		const sortBy = searchParams.get("sortBy")
		if (sortBy)
			newFilters.sortBy =
				sortBy as PropertyFilters["sortBy"]

		// Amenities and features
		const amenities =
			searchParams.get("amenities")
		if (amenities)
			newFilters.amenities = amenities.split(",")

		const features = searchParams.get("features")
		if (features)
			newFilters.features = features.split(",")

		// Year built range
		const yearBuiltMin = searchParams.get(
			"yearBuiltMin",
		)
		if (yearBuiltMin) {
			newFilters.yearBuilt = {
				...newFilters.yearBuilt,
				min: parseInt(yearBuiltMin),
			}
		}

		const yearBuiltMax = searchParams.get(
			"yearBuiltMax",
		)
		if (yearBuiltMax) {
			newFilters.yearBuilt = {
				...newFilters.yearBuilt,
				max: parseInt(yearBuiltMax),
			}
		}

		// Square feet range
		const squareFeetMin = searchParams.get(
			"squareFeetMin",
		)
		if (squareFeetMin) {
			newFilters.squareFeet = {
				...newFilters.squareFeet,
				min: parseInt(squareFeetMin),
			}
		}

		const squareFeetMax = searchParams.get(
			"squareFeetMax",
		)
		if (squareFeetMax) {
			newFilters.squareFeet = {
				...newFilters.squareFeet,
				max: parseInt(squareFeetMax),
			}
		}

		setFilters(newFilters)
		setIsLoading(false)
	}, [searchParams])

	const updateFilters = (
		newFilters: Partial<PropertyFilters>,
	) => {
		try {
			setIsLoading(true)
			const updatedFilters = {
				...filters,
				...newFilters,
			}
			const params = new URLSearchParams()

			// Price range
			if (updatedFilters.minPrice) {
				params.set(
					"minPrice",
					updatedFilters.minPrice.toString(),
				)
			}
			if (updatedFilters.maxPrice) {
				params.set(
					"maxPrice",
					updatedFilters.maxPrice.toString(),
				)
			}

			// Bedrooms and bathrooms
			if (updatedFilters.bedrooms) {
				params.set(
					"bedrooms",
					updatedFilters.bedrooms.toString(),
				)
			}
			if (updatedFilters.bathrooms) {
				params.set(
					"bathrooms",
					updatedFilters.bathrooms.toString(),
				)
			}

			// Property type and location
			if (updatedFilters.propertyType) {
				params.set(
					"propertyType",
					updatedFilters.propertyType,
				)
			}
			if (updatedFilters.location) {
				params.set(
					"location",
					updatedFilters.location,
				)
			}

			// Sort by
			if (updatedFilters.sortBy) {
				params.set(
					"sortBy",
					updatedFilters.sortBy,
				)
			}

			// Amenities and features
			if (updatedFilters.amenities?.length) {
				params.set(
					"amenities",
					updatedFilters.amenities.join(","),
				)
			}
			if (updatedFilters.features?.length) {
				params.set(
					"features",
					updatedFilters.features.join(","),
				)
			}

			// Year built range
			if (updatedFilters.yearBuilt?.min) {
				params.set(
					"yearBuiltMin",
					updatedFilters.yearBuilt.min.toString(),
				)
			}
			if (updatedFilters.yearBuilt?.max) {
				params.set(
					"yearBuiltMax",
					updatedFilters.yearBuilt.max.toString(),
				)
			}

			// Square feet range
			if (updatedFilters.squareFeet?.min) {
				params.set(
					"squareFeetMin",
					updatedFilters.squareFeet.min.toString(),
				)
			}
			if (updatedFilters.squareFeet?.max) {
				params.set(
					"squareFeetMax",
					updatedFilters.squareFeet.max.toString(),
				)
			}

			const queryString = params.toString()
			router.push(
				queryString ? `?${queryString}` : "/",
			)
		} catch (err) {
			toast.error("Failed to update filters")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const clearFilters = () => {
		try {
			setIsLoading(true)
			router.push("/")
		} catch (err) {
			toast.error("Failed to clear filters")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	return {
		filters,
		isLoading,
		updateFilters,
		clearFilters,
	}
}
