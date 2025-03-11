import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { PropertyFilters } from "./use-property-filters"

interface SearchHistoryItem {
	id: string
	timestamp: number
	filters: PropertyFilters
	query: string
}

const MAX_HISTORY_ITEMS = 10
const STORAGE_KEY = "property_search_history"

export function useSearchHistory() {
	const [history, setHistory] = useState<
		SearchHistoryItem[]
	>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		// Load search history from localStorage
		try {
			const storedHistory =
				localStorage.getItem(STORAGE_KEY)
			if (storedHistory) {
				setHistory(JSON.parse(storedHistory))
			}
		} catch (err) {
			console.error(
				"Failed to load search history:",
				err,
			)
			toast.error("Failed to load search history")
		} finally {
			setIsLoading(false)
		}
	}, [])

	// Save search history to localStorage whenever it changes
	useEffect(() => {
		try {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify(history),
			)
		} catch (err) {
			console.error(
				"Failed to save search history:",
				err,
			)
			toast.error("Failed to save search history")
		}
	}, [history])

	const addToHistory = (
		filters: PropertyFilters,
		query: string,
	) => {
		try {
			setIsLoading(true)
			const newItem: SearchHistoryItem = {
				id: Math.random()
					.toString(36)
					.substring(2),
				timestamp: Date.now(),
				filters,
				query,
			}

			setHistory((prevHistory) => {
				const updatedHistory = [
					newItem,
					...prevHistory,
				]
				return updatedHistory.slice(
					0,
					MAX_HISTORY_ITEMS,
				)
			})
		} catch (err) {
			toast.error(
				"Failed to add to search history",
			)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const removeFromHistory = (id: string) => {
		try {
			setIsLoading(true)
			setHistory((prevHistory) =>
				prevHistory.filter(
					(item) => item.id !== id,
				),
			)
		} catch (err) {
			toast.error(
				"Failed to remove from search history",
			)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const clearHistory = () => {
		try {
			setIsLoading(true)
			setHistory([])
			localStorage.removeItem(STORAGE_KEY)
		} catch (err) {
			toast.error(
				"Failed to clear search history",
			)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const getRecentSearches = (
		limit: number = MAX_HISTORY_ITEMS,
	) => {
		return history.slice(0, limit)
	}

	const getSearchById = (id: string) => {
		return history.find((item) => item.id === id)
	}

	const getSearchesByQuery = (query: string) => {
		return history.filter((item) =>
			item.query
				.toLowerCase()
				.includes(query.toLowerCase()),
		)
	}

	return {
		history,
		isLoading,
		addToHistory,
		removeFromHistory,
		clearHistory,
		getRecentSearches,
		getSearchById,
		getSearchesByQuery,
	}
}
