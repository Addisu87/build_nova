"use client"

import { useEffect } from "react"
import { useUnifiedFavorites } from "@/hooks/favorites/use-unified-favorites"
import { useAuth } from "@/contexts/auth-context"
import { PropertiesGrid } from "@/components/features/properties"
import { useProperties } from "@/hooks/properties/use-properties"
import { LoadingState } from "@/components/ui/loading-state"
import { Button } from "@/components/ui"

export default function FavoritesPage() {
	const { user } = useAuth()
	const { 
		favorites, 
		isLoading: favoritesLoading,
		migrateGuestFavorites 
	} = useUnifiedFavorites()
	
	const { data: properties, isLoading: propertiesLoading } = useProperties()

	// Attempt to migrate guest favorites when user logs in
	useEffect(() => {
		if (user) {
			migrateGuestFavorites()
		}
	}, [user])

	if (favoritesLoading || propertiesLoading) {
		return <LoadingState type="properties" />
	}

	const favoriteProperties = properties?.filter(property => 
		favorites.includes(property.id)
	) || []

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">
					{user ? 'Your Favorites' : 'Guest Favorites'}
				</h1>
				{!user && favorites.length > 0 && (
					<Button 
						onClick={() => router.push('/login')}
						variant="outline"
					>
						Sign in to save your favorites
					</Button>
				)}
			</div>

			{favoriteProperties.length === 0 ? (
				<div className="text-center py-8">
					<p className="text-gray-600 mb-4">
						You haven't added any properties to your favorites yet.
					</p>
					<Button 
						onClick={() => router.push('/properties')}
						variant="outline"
					>
						Browse Properties
					</Button>
				</div>
			) : (
				<PropertiesGrid properties={favoriteProperties} />
			)}
		</main>
	)
}
