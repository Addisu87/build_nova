import { useAuth } from "@/contexts/auth-context"
import { Property } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { usePropertyFavorites } from "./use-property-favorites"

const GUEST_FAVORITES_KEY = "guest_favorites"

export function useUnifiedFavorites() {
	const router = useRouter()
	const { user } = useAuth()
	const {
		favorites: authFavorites,
		addFavorite: addAuthFavorite,
		removeFavorite: removeAuthFavorite,
		isLoading: isAuthLoading,
	} = usePropertyFavorites()

	const [guestFavorites, setGuestFavorites] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(true)

	// Load guest favorites from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem(GUEST_FAVORITES_KEY)
		if (stored) {
			setGuestFavorites(JSON.parse(stored))
		}
		setIsLoading(false)
	}, [])

	// Save guest favorites to localStorage whenever they change
	useEffect(() => {
		localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(guestFavorites))
	}, [guestFavorites])

	const toggleFavorite = async (propertyId: string) => {
		if (user) {
			// Handle authenticated user favorites
			const favorite = authFavorites.find((fav) => fav.id === propertyId)
			if (favorite) {
				await removeAuthFavorite(favorite.favoriteId)
				toast.success("Removed from favorites")
			} else {
				await addAuthFavorite({ id: propertyId } as Property)
				toast.success("Added to favorites")
			}
		} else {
			// Handle guest favorites
			if (guestFavorites.includes(propertyId)) {
				setGuestFavorites((prev) => prev.filter((id) => id !== propertyId))
				toast.success("Removed from favorites")
			} else {
				setGuestFavorites((prev) => [...prev, propertyId])
				toast.success("Added to favorites")
			}
		}
	}

	const isFavorite = (propertyId: string): boolean => {
		if (user) {
			return authFavorites.some((fav) => fav.id === propertyId)
		}
		return guestFavorites.includes(propertyId)
	}

	const migrateGuestFavorites = async () => {
		if (!user || guestFavorites.length === 0) return

		try {
			setIsLoading(true)
			for (const propertyId of guestFavorites) {
				if (!authFavorites.some((fav) => fav.id === propertyId)) {
					await addAuthFavorite({ id: propertyId } as Property)
				}
			}
			// Clear guest favorites after successful migration
			setGuestFavorites([])
			toast.success("Favorites synchronized successfully")
		} catch (error) {
			toast.error("Failed to sync favorites")
			console.error("Failed to migrate guest favorites:", error)
		} finally {
			setIsLoading(false)
		}
	}

	return {
		favorites: user ? authFavorites : guestFavorites,
		isLoading: isLoading || isAuthLoading,
		toggleFavorite,
		isFavorite,
		migrateGuestFavorites,
	}
}
