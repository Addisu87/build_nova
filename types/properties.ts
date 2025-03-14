// Property Status and Types
export type PropertyStatus =
	| "FOR_SALE"
	| "FOR_RENT"
	| "SOLD"
	| "RENTED"

export type PropertyType =
	| "HOUSE"
	| "APARTMENT"
	| "CONDO"
	| "TOWNHOUSE"
	| "LAND"
	| "COMMERCIAL"
	| "VACATION_RENTAL"
	| "FARMS"
	| "FLATS"
	| "INDUSTRIAL"
	| "MOBILE_HOME"
	| "MULTI_FAMILY"
	| "OTHER"

// Sort Options
export type SortOption =
	| "price_asc"
	| "price_desc"
	| "date_desc"
	| "date_asc"
	| "beds_asc"
	| "beds_desc"
	| "baths_asc"
	| "baths_desc"
	| "sqft_asc"
	| "sqft_desc"
	| "rating_desc"

export interface PropertyLocation {
	lat: number
	lng: number
	address: string
	city: string
	state: string
	zipCode: string
}

// Property Interface
export interface Property {
	id: string
	title: string
	price: number
	location: PropertyLocation
	bedrooms: number
	bathrooms: number
	area: number
	images: string[]
	imageUrl: string
	propertyType:
		| "house"
		| "apartment"
		| "condo"
		| "townhouse"
		| "land"
	status:
		| "for-sale"
		| "for-rent"
		| "sold"
		| "pending"
	yearBuilt?: number
	createdAt: string
	updatedAt: string
	description?: string
	amenities?: string[]
	lotSize?: number
	parkingSpaces?: number
	squareFeet?: number
	rating?: number
}

// Range type for numeric filters
export interface Range {
	min: string
	max: string
}

// Filter Interface
export interface PropertyFilters {
	searchQuery?: string
	minPrice: string
	maxPrice: string
	bedrooms: string
	bathrooms: string
	propertyType: string
	location: string
	amenities: string[]
	squareFootage: {
		min: string
		max: string
	}
	yearBuilt: {
		min: string
		max: string
	}
	sortBy?: SortOption
}

// API Filter Interface (for backend queries)
export interface PropertyApiFilters {
	minPrice?: number
	maxPrice?: number
	bedrooms?: number
	bathrooms?: number
	propertyType?: PropertyType
	location?: string
	status?: PropertyStatus
	amenities?: string[]
	squareFootage?: {
		min?: number
		max?: number
	}
	yearBuilt?: {
		min?: number
		max?: number
	}
	lotSize?: {
		min?: number
		max?: number
	}
	sortBy?: SortOption
	page?: number
	limit?: number
}

// Constants
export const SORT_OPTIONS: Record<
	SortOption,
	string
> = {
	price_asc: "Price: Low to High",
	price_desc: "Price: High to Low",
	date_desc: "Newest First",
	date_asc: "Oldest First",
	beds_asc: "Bedrooms: Low to High",
	beds_desc: "Bedrooms: High to Low",
	baths_asc: "Bathrooms: Low to High",
	baths_desc: "Bathrooms: High to Low",
	sqft_asc: "Square Feet: Low to High",
	sqft_desc: "Square Feet: High to Low",
	rating_desc: "Highest Rated",
} as const

export const PROPERTY_TYPES: Record<
	PropertyType,
	string
> = {
	HOUSE: "House",
	APARTMENT: "Apartment",
	CONDO: "Condo",
	TOWNHOUSE: "Townhouse",
	LAND: "Land",
	COMMERCIAL: "Commercial",
	VACATION_RENTAL: "Vacation Rental",
	FARMS: "Farms",
	FLATS: "Flats",
	INDUSTRIAL: "Industrial",
	MOBILE_HOME: "Mobile Home",
	MULTI_FAMILY: "Multi-Family",
	OTHER: "Other",
} as const

export const AMENITIES = [
	{ value: "pool", label: "Pool" },
	{ value: "gym", label: "Gym" },
	{ value: "parking", label: "Parking" },
	{ value: "security", label: "Security" },
	{ value: "garden", label: "Garden" },
	{ value: "elevator", label: "Elevator" },
	{
		value: "airConditioning",
		label: "Air Conditioning",
	},
	{ value: "heating", label: "Heating" },
	{ value: "laundry", label: "Laundry" },
	{ value: "storage", label: "Storage" },
	{ value: "petsAllowed", label: "Pets Allowed" },
	{ value: "furnished", label: "Furnished" },
] as const
