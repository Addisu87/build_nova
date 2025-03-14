import { LoadingState } from "@/components/ui/loading-state"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
	Button,
	Card,
	Skeleton,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	toast,
} from "@/components/ui"
import { PropertyFilters } from "./filters"
import type {
	PropertyFiltersType,
	Property,
} from "@/types/properties"
import { mockProperties } from "./mock-data"
import Link from "next/link"
import Image from "next/image"
import {
	Heart,
	Bath,
	Bed,
	Square,
	ArrowUpDown,
} from "lucide-react"
import { usePropertyManager } from "@/hooks/properties/use-property-manager"
import { PropertyCard } from "./card"
import { useFavorites } from "@/hooks/favorites/use-favorites"

interface PropertiesGridProps {
	properties: Property[]
}

export function PropertiesGrid({
	properties,
}: PropertiesGridProps) {
	const { toggleFavorite, isFavorited } =
		useFavorites()

	if (!properties || properties.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-500">
					No properties found.
				</p>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{properties.map((property) => (
				<PropertyCard
					key={property.id}
					property={property}
					onFavoriteToggle={() =>
						toggleFavorite(property.id)
					}
					isFavorited={isFavorited(property.id)}
				/>
			))}
		</div>
	)
}
