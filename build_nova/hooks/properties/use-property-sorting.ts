import { useState, useEffect } from "react"
import {
	useRouter,
	useSearchParams,
} from "next/navigation"
import { toast } from "react-hot-toast"

export type SortOption =
	| "price_asc"
	| "price_desc"
	| "newest"
	| "oldest"
	| "beds_asc"
	| "beds_desc"
	| "baths_asc"
	| "baths_desc"
	| "sqft_asc"
	| "sqft_desc"
	| "rating_desc"

export interface SortState {
	sortBy: SortOption
	label: string
}

const SORT_OPTIONS: Record<SortOption, string> = {
	price_asc: "Price: Low to High",
	price_desc: "Price: High to Low",
	newest: "Newest First",
	oldest: "Oldest First",
	beds_asc: "Bedrooms: Low to High",
	beds_desc: "Bedrooms: High to Low",
	baths_asc: "Bathrooms: Low to High",
	baths_desc: "Bathrooms: High to Low",
	sqft_asc: "Square Feet: Low to High",
	sqft_desc: "Square Feet: High to Low",
	rating_desc: "Highest Rated",
}

const DEFAULT_SORT: SortState = {
	sortBy: "newest",
	label: SORT_OPTIONS.newest,
}

export function usePropertySorting() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [sort, setSort] =
		useState<SortState>(DEFAULT_SORT)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		// Parse search params into sort state
		const sortBy = searchParams.get(
			"sortBy",
		) as SortOption

		if (sortBy && SORT_OPTIONS[sortBy]) {
			setSort({
				sortBy,
				label: SORT_OPTIONS[sortBy],
			})
		} else {
			setSort(DEFAULT_SORT)
		}

		setIsLoading(false)
	}, [searchParams])

	const updateSort = (sortBy: SortOption) => {
		try {
			setIsLoading(true)
			const newSort = {
				sortBy,
				label: SORT_OPTIONS[sortBy],
			}

			const params = new URLSearchParams(
				searchParams.toString(),
			)

			if (sortBy !== DEFAULT_SORT.sortBy) {
				params.set("sortBy", sortBy)
			} else {
				params.delete("sortBy")
			}

			const queryString = params.toString()
			router.push(
				queryString ? `?${queryString}` : "/",
			)
		} catch (err) {
			toast.error("Failed to update sorting")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const resetSort = () => {
		try {
			setIsLoading(true)
			const params = new URLSearchParams(
				searchParams.toString(),
			)
			params.delete("sortBy")
			const queryString = params.toString()
			router.push(
				queryString ? `?${queryString}` : "/",
			)
		} catch (err) {
			toast.error("Failed to reset sorting")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	return {
		sort,
		isLoading,
		updateSort,
		resetSort,
		sortOptions: SORT_OPTIONS,
	}
}
