import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { Database } from "@/types/supabase"
import { supabase } from "@/lib/supabase/db"
import { useAuth } from "./use-auth"
import { PropertyFilters } from "./use-property-filters"

interface SearchAnalytics {
	id: string
	user_id: string
	timestamp: string
	query: string
	filters: PropertyFilters
	result_count: number
	search_duration: number
	success: boolean
}

interface AnalyticsSummary {
	totalSearches: number
	averageSearchDuration: number
	successRate: number
	popularFilters: {
		[key: string]: number
	}
	popularLocations: {
		[key: string]: number
	}
	popularPropertyTypes: {
		[key: string]: number
	}
	searchTrends: {
		[key: string]: number
	}
}

export function usePropertyAnalytics() {
	const { user } = useAuth()
	const [analytics, setAnalytics] = useState<
		SearchAnalytics[]
	>([])
	const [summary, setSummary] =
		useState<AnalyticsSummary>({
			totalSearches: 0,
			averageSearchDuration: 0,
			successRate: 0,
			popularFilters: {},
			popularLocations: {},
			popularPropertyTypes: {},
			searchTrends: {},
		})
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (!user) {
			setIsLoading(false)
			return
		}

		async function fetchAnalytics() {
			try {
				setIsLoading(true)
				const { data, error } = await supabase
					.from("search_analytics")
					.select("*")
					.eq("user_id", user.id)
					.order("timestamp", {
						ascending: false,
					})

				if (error) {
					throw error
				}

				setAnalytics(data || [])
				calculateSummary(data || [])
			} catch (err) {
				console.error(
					"Failed to fetch analytics:",
					err,
				)
				toast.error("Failed to load analytics")
			} finally {
				setIsLoading(false)
			}
		}

		fetchAnalytics()
	}, [user])

	const calculateSummary = (
		data: SearchAnalytics[],
	) => {
		const totalSearches = data.length
		const successfulSearches = data.filter(
			(item) => item.success,
		).length
		const totalDuration = data.reduce(
			(sum, item) => sum + item.search_duration,
			0,
		)
		const averageDuration =
			totalSearches > 0
				? totalDuration / totalSearches
				: 0
		const successRate =
			totalSearches > 0
				? (successfulSearches / totalSearches) *
				  100
				: 0

		// Calculate popular filters
		const popularFilters: {
			[key: string]: number
		} = {}
		const popularLocations: {
			[key: string]: number
		} = {}
		const popularPropertyTypes: {
			[key: string]: number
		} = {}
		const searchTrends: {
			[key: string]: number
		} = {}

		data.forEach((item) => {
			// Count filter usage
			Object.entries(item.filters).forEach(
				([key, value]) => {
					if (value) {
						popularFilters[key] =
							(popularFilters[key] || 0) + 1
					}
				},
			)

			// Count location usage
			if (item.filters.location) {
				popularLocations[item.filters.location] =
					(popularLocations[
						item.filters.location
					] || 0) + 1
			}

			// Count property type usage
			if (item.filters.propertyType) {
				popularPropertyTypes[
					item.filters.propertyType
				] =
					(popularPropertyTypes[
						item.filters.propertyType
					] || 0) + 1
			}

			// Count searches by date
			const date = new Date(item.timestamp)
				.toISOString()
				.split("T")[0]
			searchTrends[date] =
				(searchTrends[date] || 0) + 1
		})

		setSummary({
			totalSearches,
			averageSearchDuration: averageDuration,
			successRate,
			popularFilters,
			popularLocations,
			popularPropertyTypes,
			searchTrends,
		})
	}

	const logSearch = async (
		query: string,
		filters: PropertyFilters,
		resultCount: number,
		duration: number,
		success: boolean,
	) => {
		if (!user) {
			return
		}

		try {
			const { data, error } = await supabase
				.from("search_analytics")
				.insert({
					user_id: user.id,
					query,
					filters,
					result_count: resultCount,
					search_duration: duration,
					success,
				})
				.select()
				.single()

			if (error) {
				throw error
			}

			setAnalytics((prev) => [data, ...prev])
			calculateSummary([data, ...analytics])
		} catch (err) {
			console.error("Failed to log search:", err)
			toast.error(
				"Failed to log search analytics",
			)
			throw err
		}
	}

	const getPopularLocations = (
		limit: number = 5,
	) => {
		return Object.entries(
			summary.popularLocations,
		)
			.sort(([, a], [, b]) => b - a)
			.slice(0, limit)
			.map(([location, count]) => ({
				location,
				count,
			}))
	}

	const getPopularPropertyTypes = (
		limit: number = 5,
	) => {
		return Object.entries(
			summary.popularPropertyTypes,
		)
			.sort(([, a], [, b]) => b - a)
			.slice(0, limit)
			.map(([type, count]) => ({ type, count }))
	}

	const getSearchTrends = (days: number = 7) => {
		const today = new Date()
		const trends = []

		for (let i = days - 1; i >= 0; i--) {
			const date = new Date(today)
			date.setDate(date.getDate() - i)
			const dateString = date
				.toISOString()
				.split("T")[0]

			trends.push({
				date: dateString,
				count:
					summary.searchTrends[dateString] || 0,
			})
		}

		return trends
	}

	return {
		analytics,
		summary,
		isLoading,
		logSearch,
		getPopularLocations,
		getPopularPropertyTypes,
		getSearchTrends,
	}
}
