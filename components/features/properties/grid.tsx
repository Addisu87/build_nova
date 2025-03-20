import type { Property } from "@/types"
import { PropertyCard } from "./card"

import { useFavorites } from "@/hooks/favorites/use-favorites"

interface PropertiesGridProps {
	properties: Property[]
}

export function PropertiesGrid({ properties }: PropertiesGridProps) {
	const { toggleFavorite, isFavorited } = useFavorites()

	if (!properties || properties.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-500">No properties found.</p>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{properties.map((property) => (
				<PropertyCard
					key={property.id}
					property={property}
					onFavoriteToggle={() => toggleFavorite(property.id)}
					isFavorited={isFavorited(property.id)}
				/>
			))}
		</div>
	)
}
