"use client"

import { PropertiesGrid, PropertyCard } from "@/components/features/properties"
import { Button } from "@/components/ui"
import { LoadingState } from "@/components/ui/loading-state"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/hooks/favorites/use-favorites"
import Link from "next/link"
import { useEffect } from "react"

export default function FavoritesPage() {
	const { user } = useAuth()
	const { favorites, isLoading, migrateGuestFavorites, removeFavorite } = useFavorites()

	// Attempt to migrate guest favorites when user logs in
	useEffect(() => {
		if (user) {
			migrateGuestFavorites()
		}
	}, [user])

	if (isLoading) {
		return <LoadingState type="properties" />
	}

	const handleRemoveFavorite = async (propertyId: string) => {
		try {
			await removeFavorite(propertyId)
		} catch (error) {
			console.error("Failed to remove favorite:", error)
		}
	}

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">
					{user ? "Your Favorites" : "Guest Favorites"}
				</h1>
				{!user && favorites.length > 0 && (
					<Button asChild variant="outline">
						<Link href="/auth/login">Sign in to save your favorites</Link>
					</Button>
				)}
			</div>

			{favorites.length === 0 ? (
				<div className="text-center py-8">
					<p className="text-gray-600 mb-4">
						You haven't added any properties to your favorites yet.
					</p>
					<Button asChild variant="outline">
						<Link href="/buy/browse-all-homes">Browse Properties</Link>
					</Button>
				</div>
			) : (
				<PropertiesGrid
					properties={favorites}
					customPropertyCard={(property) => (
						<PropertyCard
							key={property.id}
							property={property}
							onFavoriteToggle={() => handleRemoveFavorite(property.id)}
						/>
					)}
				/>
			)}
		</main>
	)
}
