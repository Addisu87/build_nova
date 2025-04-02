import { FavoriteProperty } from "@/hooks/favorites/use-favorites"
import type { Property } from "@/types"
import { PropertyCard } from "./property-card"

interface PropertiesGridProps {
	properties: Property[] | FavoriteProperty[]
	customPropertyCard?: (property: FavoriteProperty) => React.ReactNode
}

export function PropertiesGrid({
	properties,
	customPropertyCard,
}: PropertiesGridProps) {
	if (!properties || properties.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-500">No properties found.</p>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{properties.map((property) =>
				customPropertyCard ? (
					customPropertyCard(property as FavoriteProperty)
				) : (
					<PropertyCard key={property.id} property={property} />
				),
			)}
		</div>
	)
}
