import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Database } from "@/types/supabase"
import {
	getFavorites,
	addFavorite,
	removeFavorite,
} from "@/lib/supabase/db"
import { useAuth } from "@/contexts/auth-context"

type Property =
	Database["public"]["Tables"]["properties"]["Row"]

export function useFavorites() {
	const router = useRouter()
	const { user } = useAuth()
	const [favorites, setFavorites] = useState<
		Property[]
	>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] =
		useState<Error | null>(null)

	useEffect(() => {
		async function fetchFavorites() {
			if (!user) {
				setIsLoading(false)
				return
			}

			try {
				setIsLoading(true)
				const data = await getFavorites(user.id)
				setFavorites(
					data.map(
						(favorite) => favorite.property,
					),
				)
			} catch (err) {
				setError(
					err instanceof Error
						? err
						: new Error(
								"Failed to fetch favorites",
						  ),
				)
				toast.error("Failed to load favorites")
			} finally {
				setIsLoading(false)
			}
		}

		fetchFavorites()
	}, [user])

	const toggleFavorite = async (
		propertyId: string,
	) => {
		if (!user) {
			toast.error(
				"Please sign in to add favorites",
			)
			router.push("/login")
			return
		}

		try {
			setIsLoading(true)
			const isFavorited = favorites.some(
				(favorite) => favorite.id === propertyId,
			)

			if (isFavorited) {
				await removeFavorite(user.id, propertyId)
				setFavorites(
					favorites.filter(
						(favorite) =>
							favorite.id !== propertyId,
					),
				)
				toast.success("Removed from favorites")
			} else {
				await addFavorite(user.id, propertyId)
				const property = await getProperty(
					propertyId,
				)
				setFavorites([...favorites, property])
				toast.success("Added to favorites")
			}
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error(
							"Failed to update favorites",
					  ),
			)
			toast.error("Failed to update favorites")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const isFavorited = (propertyId: string) => {
		return favorites.some(
			(favorite) => favorite.id === propertyId,
		)
	}

	return {
		favorites,
		isLoading,
		error,
		toggleFavorite,
		isFavorited,
	}
}
