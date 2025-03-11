export interface Property {
	id: string
	title: string
	price: number
	location: string
	bedrooms: number
	bathrooms: number
	area: number
	imageUrl: string
	propertyType: PropertyType
	createdAt: string
	updatedAt: string
}

export enum PropertyType {
	House = "house",
	Apartment = "apartment",
	Condo = "condo",
	Townhouse = "townhouse",
	Land = "land",
}

export interface PropertyFilters {
	minPrice: string
	maxPrice: string
	bedrooms: string
	bathrooms: string
	propertyType: string
}

export type SortOption =
	| "price-asc"
	| "price-desc"
	| "newest"
	| "oldest"
