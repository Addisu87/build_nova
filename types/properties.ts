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
	createdAt?: string
	updatedAt?: string
	description?: string
	amenities?: string[]
	yearBuilt?: number
	lotSize?: number
	parkingSpaces?: number
	status?: PropertyStatus
}

export type PropertyType =
	| "House"
	| "Apartment"
	| "Condo"
	| "Townhouse"
	| "Land"

export type PropertyStatus =
	| "for-sale"
	| "for-rent"
	| "sold"
	| "pending"

export type SortOption =
	| "price-asc"
	| "price-desc"
	| "newest"
	| "oldest"

export interface PropertyFilters {
	minPrice: string
	maxPrice: string
	bedrooms: string
	bathrooms: string
	propertyType: string
	location: string
	status?: PropertyStatus[]
}
