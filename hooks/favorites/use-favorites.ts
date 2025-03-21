import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { Database } from "@/types/supabase"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type Property = Database["public"]["Tables"]["properties"]["Row"]

interface FavoriteProperty extends Property {
	favoriteId: string
	addedAt: string
}

const GUEST_FAVORITES_KEY = "guest_favorites"

export function useFavorites() {
	const { user } = useAuth()
	const [favorites, setFavorites] = useState<FavoriteProperty[]>([])
	const [isLoading, setIsLoading] = useState(true)

	// Load favorites based on auth state
	useEffect(() => {
		async function loadFavorites() {
			try {
				setIsLoading(true)

				if (user) {
					// Load authenticated user favorites
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
						.order("created_at", { ascending: false })

					if (error) throw error

					setFavorites(
						data.map((item) => ({
							...item.property,
							favoriteId: item.id,
							addedAt: item.created_at,
						})),
					)
				} else {
					// Load guest favorites from localStorage
					const stored = localStorage.getItem(GUEST_FAVORITES_KEY)
					if (stored) {
						const guestFavorites = JSON.parse(stored)
						setFavorites(guestFavorites)
					}
				}
			} catch (err) {
				console.error("Failed to load favorites:", err)
				toast.error("Failed to load favorites")
			} finally {
				setIsLoading(false)
			}
		}

		loadFavorites()
	}, [user])

	// Save guest favorites to localStorage
	useEffect(() => {
		if (!user && favorites.length > 0) {
			localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(favorites))
		}
	}, [favorites, user])

	const addFavorite = async (property: Property) => {
		try {
			if (user) {
				// Add favorite for authenticated user
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

				if (error) throw error

				const newFavorite: FavoriteProperty = {
					...data.property,
					favoriteId: data.id,
					addedAt: data.created_at,
				}

				setFavorites((prev) => [newFavorite, ...prev])
			} else {
				// Add to guest favorites
				const newFavorite: FavoriteProperty = {
					...property,
					favoriteId: Date.now().toString(), // Temporary ID for guest
					addedAt: new Date().toISOString(),
				}
				setFavorites((prev) => [newFavorite, ...prev])
			}

			toast.success("Added to favorites")
		} catch (err) {
			console.error("Failed to add favorite:", err)
			toast.error("Failed to add to favorites")
			throw err
		}
	}

	const removeFavorite = async (favoriteId: string) => {
		try {
			if (user) {
				// Remove favorite for authenticated user
				const { error } = await supabase.from("favorites").delete().eq("id", favoriteId)

				if (error) throw error
			}

			setFavorites((prev) =>
				prev.filter((favorite) => favorite.favoriteId !== favoriteId),
			)

			toast.success("Removed from favorites")
		} catch (err) {
			console.error("Failed to remove favorite:", err)
			toast.error("Failed to remove from favorites")
			throw err
		}
	}

	const migrateGuestFavorites = async () => {
		if (!user || favorites.length === 0) return

		try {
			setIsLoading(true)

			// Insert all guest favorites
			for (const favorite of favorites) {
				await supabase.from("favorites").insert({
					user_id: user.id,
					property_id: favorite.id,
				})
			}

			// Clear guest favorites
			localStorage.removeItem(GUEST_FAVORITES_KEY)

			// Reload authenticated favorites
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
				.order("created_at", { ascending: false })

			if (error) throw error

			setFavorites(
				data.map((item) => ({
					...item.property,
					favoriteId: item.id,
					addedAt: item.created_at,
				})),
			)

			toast.success("Favorites synchronized successfully")
		} catch (err) {
			console.error("Failed to migrate favorites:", err)
			toast.error("Failed to sync favorites")
		} finally {
			setIsLoading(false)
		}
	}

	const isFavorite = (propertyId: string): boolean => {
		return favorites.some((favorite) => favorite.id === propertyId)
	}

	const getFavoriteId = (propertyId: string): string | undefined => {
		return favorites.find((favorite) => favorite.id === propertyId)?.favoriteId
	}

	return {
		favorites,
		isLoading,
		addFavorite,
		removeFavorite,
		isFavorite,
		getFavoriteId,
		migrateGuestFavorites,
	}
}
