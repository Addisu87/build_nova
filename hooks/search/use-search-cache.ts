import {
	useState,
	useEffect,
	useCallback,
} from "react"
import { toast } from "react-hot-toast"
import { Database } from "@/types/supabase"
import { PropertyFilters } from "./use-property-filters"

interface CacheItem<T> {
	data: T
	timestamp: number
	query: string
	filters: PropertyFilters
}

interface CacheConfig {
	maxSize: number
	expirationTime: number
}

const DEFAULT_CONFIG: CacheConfig = {
	maxSize: 100,
	expirationTime: 5 * 60 * 1000, // 5 minutes
}

export function useSearchCache<T>(
	config: Partial<CacheConfig> = {},
) {
	const [cache, setCache] = useState<
		Map<string, CacheItem<T>>
	>(new Map())
	const [isLoading, setIsLoading] = useState(true)
	const finalConfig = {
		...DEFAULT_CONFIG,
		...config,
	}

	useEffect(() => {
		// Load cache from localStorage on mount
		try {
			const storedCache = localStorage.getItem(
				"search_cache",
			)
			if (storedCache) {
				const parsedCache =
					JSON.parse(storedCache)
				const map = new Map(
					Object.entries(parsedCache),
				)
				setCache(map)
			}
		} catch (err) {
			console.error(
				"Failed to load search cache:",
				err,
			)
			toast.error("Failed to load search cache")
		} finally {
			setIsLoading(false)
		}
	}, [])

	// Save cache to localStorage whenever it changes
	useEffect(() => {
		try {
			const cacheObject =
				Object.fromEntries(cache)
			localStorage.setItem(
				"search_cache",
				JSON.stringify(cacheObject),
			)
		} catch (err) {
			console.error(
				"Failed to save search cache:",
				err,
			)
			toast.error("Failed to save search cache")
		}
	}, [cache])

	const generateCacheKey = useCallback(
		(
			query: string,
			filters: PropertyFilters,
		): string => {
			return `${query}-${JSON.stringify(filters)}`
		},
		[],
	)

	const get = useCallback(
		(
			query: string,
			filters: PropertyFilters,
		): T | null => {
			const key = generateCacheKey(query, filters)
			const item = cache.get(key)

			if (!item) {
				return null
			}

			const isExpired =
				Date.now() - item.timestamp >
				finalConfig.expirationTime
			if (isExpired) {
				cache.delete(key)
				return null
			}

			return item.data
		},
		[
			cache,
			generateCacheKey,
			finalConfig.expirationTime,
		],
	)

	const set = useCallback(
		(
			query: string,
			filters: PropertyFilters,
			data: T,
		): void => {
			try {
				const key = generateCacheKey(
					query,
					filters,
				)
				const newItem: CacheItem<T> = {
					data,
					timestamp: Date.now(),
					query,
					filters,
				}

				setCache((prevCache) => {
					const newCache = new Map(prevCache)

					// Remove oldest item if cache is full
					if (
						newCache.size >= finalConfig.maxSize
					) {
						const oldestKey = Array.from(
							newCache.entries(),
						).sort(
							([, a], [, b]) =>
								a.timestamp - b.timestamp,
						)[0][0]
						newCache.delete(oldestKey)
					}

					newCache.set(key, newItem)
					return newCache
				})
			} catch (err) {
				console.error(
					"Failed to set cache item:",
					err,
				)
				toast.error(
					"Failed to cache search results",
				)
			}
		},
		[generateCacheKey, finalConfig.maxSize],
	)

	const remove = useCallback(
		(
			query: string,
			filters: PropertyFilters,
		): void => {
			const key = generateCacheKey(query, filters)
			setCache((prevCache) => {
				const newCache = new Map(prevCache)
				newCache.delete(key)
				return newCache
			})
		},
		[generateCacheKey],
	)

	const clear = useCallback((): void => {
		setCache(new Map())
		localStorage.removeItem("search_cache")
	}, [])

	const getCacheSize = useCallback((): number => {
		return cache.size
	}, [cache])

	const getCacheKeys =
		useCallback((): string[] => {
			return Array.from(cache.keys())
		}, [cache])

	const getCacheItems =
		useCallback((): CacheItem<T>[] => {
			return Array.from(cache.values())
		}, [cache])

	const isExpired = useCallback(
		(
			query: string,
			filters: PropertyFilters,
		): boolean => {
			const key = generateCacheKey(query, filters)
			const item = cache.get(key)

			if (!item) {
				return true
			}

			return (
				Date.now() - item.timestamp >
				finalConfig.expirationTime
			)
		},
		[
			cache,
			generateCacheKey,
			finalConfig.expirationTime,
		],
	)

	return {
		get,
		set,
		remove,
		clear,
		getCacheSize,
		getCacheKeys,
		getCacheItems,
		isExpired,
		isLoading,
	}
}
