"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import {
	PropertyFilters,
	PropertiesGrid,
} from "@/components/features/properties"
import { mockProperties } from "@/components/features/properties/mock-data"
import { Property } from "@/components/features/properties/types"

export default function SearchPage() {
	const searchParams = useSearchParams()
	const query = searchParams.get("q")
	const [filters, setFilters] = useState({
		minPrice: "",
		maxPrice: "",
		bedrooms: "",
		bathrooms: "",
		propertyType: "",
		location: "",
		status: undefined,
	})

	const filteredProperties =
		mockProperties.filter((property) => {
			if (
				query &&
				!property.title
					.toLowerCase()
					.includes(query.toLowerCase())
			) {
				return false
			}

			if (
				filters.minPrice &&
				property.price < Number(filters.minPrice)
			) {
				return false
			}

			if (
				filters.maxPrice &&
				property.price > Number(filters.maxPrice)
			) {
				return false
			}

			if (
				filters.bedrooms &&
				property.bedrooms <
					Number(filters.bedrooms)
			) {
				return false
			}

			if (
				filters.bathrooms &&
				property.bathrooms <
					Number(filters.bathrooms)
			) {
				return false
			}

			if (
				filters.propertyType &&
				property.propertyType.toLowerCase() !==
					filters.propertyType
			) {
				return false
			}

			return true
		})

	return (
		<main className="container mx-auto px-4 py-8">
			<h1 className="mb-6 text-2xl font-bold">
				{query
					? `Search results for "${query}"`
					: "All Properties"}
			</h1>

			<div className="mb-8">
				<PropertyFilters
					filters={filters}
					onChange={(newFilters) =>
						setFilters((prev) => ({
							...prev,
							...newFilters,
						}))
					}
				/>
			</div>

			<PropertiesGrid
				properties={filteredProperties}
			/>
		</main>
	)
}
