"use client"

import { usePropertyFavorites } from "@/hooks/favorites/use-property-favorites"
import { PropertiesGrid } from "@/components/features/properties"
import { mockProperties } from "@/components/features/properties/mock-data"

export default function FavoritesPage() {
	const { favorites } = usePropertyFavorites()
	const favoriteProperties =
		mockProperties.filter((property) =>
			favorites.includes(property.id),
		)

	return (
		<main className="container mx-auto px-4 py-8">
			<h1 className="mb-6 text-2xl font-bold">
				Favorite Properties
			</h1>
			{favoriteProperties.length === 0 ? (
				<p className="text-gray-600">
					You haven't added any properties to your
					favorites yet.
				</p>
			) : (
				<PropertiesGrid
					properties={favoriteProperties}
				/>
			)}
		</main>
	)
}
