import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { Database } from "@/types/supabase"
import { supabase } from "@/lib/supabase/db"
import { useAuth } from "./use-auth"

type Property =
	Database["public"]["Tables"]["properties"]["Row"]

interface FavoriteProperty extends Property {
	favoriteId: string
	addedAt: string
}

const STORAGE_KEY = "property_favorites"

export function usePropertyFavorites() {
	const { user } = useAuth()
	const [favorites, setFavorites] = useState<
		FavoriteProperty[]
	>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		async function fetchFavorites() {
			if (!user) {
				setIsLoading(false)
				return
			}

			try {
				setIsLoading(true)
				const { data, error } = await supabase
					.from("favorites")
					.select(
						`
            id,
            created_at,
            property:properties(*)
          `,
					)
					.eq("user_id", user.id)
					.order("created_at", {
						ascending: false,
					})

				if (error) {
					throw error
				}

				const formattedFavorites = data.map(
					(item) => ({
						...item.property,
						favoriteId: item.id,
						addedAt: item.created_at,
					}),
				)

				setFavorites(formattedFavorites)
			} catch (err) {
				console.error(
					"Failed to fetch favorites:",
					err,
				)
				toast.error("Failed to load favorites")
			} finally {
				setIsLoading(false)
			}
		}

		fetchFavorites()
	}, [user])

	const addFavorite = async (
		property: Property,
	) => {
		if (!user) {
			toast.error(
				"Please sign in to add favorites",
			)
			throw new Error("User not authenticated")
		}

		try {
			setIsLoading(true)
			const { data, error } = await supabase
				.from("favorites")
				.insert({
					user_id: user.id,
					property_id: property.id,
				})
				.select(
					`
          id,
          created_at,
          property:properties(*)
        `,
				)
				.single()

			if (error) {
				throw error
			}

			const newFavorite: FavoriteProperty = {
				...data.property,
				favoriteId: data.id,
				addedAt: data.created_at,
			}

			setFavorites((prevFavorites) => [
				newFavorite,
				...prevFavorites,
			])
			toast.success("Added to favorites")
		} catch (err) {
			console.error(
				"Failed to add favorite:",
				err,
			)
			toast.error("Failed to add to favorites")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const removeFavorite = async (
		favoriteId: string,
	) => {
		try {
			setIsLoading(true)
			const { error } = await supabase
				.from("favorites")
				.delete()
				.eq("id", favoriteId)

			if (error) {
				throw error
			}

			setFavorites((prevFavorites) =>
				prevFavorites.filter(
					(favorite) =>
						favorite.favoriteId !== favoriteId,
				),
			)
			toast.success("Removed from favorites")
		} catch (err) {
			console.error(
				"Failed to remove favorite:",
				err,
			)
			toast.error(
				"Failed to remove from favorites",
			)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const isFavorite = (
		propertyId: string,
	): boolean => {
		return favorites.some(
			(favorite) => favorite.id === propertyId,
		)
	}

	const getFavoriteId = (
		propertyId: string,
	): string | undefined => {
		return favorites.find(
			(favorite) => favorite.id === propertyId,
		)?.favoriteId
	}

	const getFavoritesByPropertyType = (
		propertyType: string,
	) => {
		return favorites.filter(
			(favorite) =>
				favorite.property_type === propertyType,
		)
	}

	const getFavoritesByPriceRange = (
		minPrice: number,
		maxPrice: number,
	) => {
		return favorites.filter(
			(favorite) =>
				favorite.price >= minPrice &&
				favorite.price <= maxPrice,
		)
	}

	const getFavoritesByLocation = (
		location: string,
	) => {
		return favorites.filter((favorite) =>
			favorite.location
				.toLowerCase()
				.includes(location.toLowerCase()),
		)
	}

	return {
		favorites,
		isLoading,
		addFavorite,
		removeFavorite,
		isFavorite,
		getFavoriteId,
		getFavoritesByPropertyType,
		getFavoritesByPriceRange,
		getFavoritesByLocation,
	}
}
