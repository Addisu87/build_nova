// Property Status and Types
export type PropertyStatus = "for-sale" | "for-rent" | "sold" | "pending"

export type PropertyType =
	| "SINGLE_FAMILY_HOME"
	| "APARTMENT"
	| "CONDO"
	| "TOWNHOUSE"
	| "MULTI_FAMILY_HOME"
	| "LAND"
	| "COMMERCIAL"
	| "VACATION_RENTAL"
	| "FARM"
	| "FLAT"
	| "INDUSTRIAL"
	| "MOBILE_HOME"
	| "OTHER"

// Sort Options
export type SortOption = keyof typeof SORT_OPTIONS

export interface PropertyLocation {
	latitude: number
	longitude: number
	address: string
	city: string
	state: string
	zip_code: string
}

// Property Interface
export interface Property {
	id: string
	title: string
	description: string
	price: number
	bedrooms: number
	bathrooms: number
	square_feet: number
	address: string
	city: string
	state: string
	zip_code: string
	latitude: number
	longitude: number
	images: string[]
	features: string[]
	imageUrl: string
	status: PropertyStatus
	property_type: PropertyType
	amenities: string[]
	year_built: number
	lot_size?: number
	parking_spaces?: number
	heating_type?: string
	cooling_type?: string
	hoa_fees?: number
	property_tax?: number
	mls_number?: string
	listing_date?: string
	days_on_market?: number
	school_district?: string
	walk_score?: number
	transit_score?: number
	bike_score?: number
	price_per_square_foot?: number
	estimate?: number
	rent_estimate?: number
	last_sold_price?: number
	last_sold_date?: string
	created_at?: string
	updated_at?: string
	user_id: string
}

// Range type for numeric filters
export interface Range {
	min: string
	max: string
}

// Filter Interface
export interface PropertyFilters extends Partial<Record<string, unknown>> {
	searchQuery?: string
	min_price?: number
	max_price?: number
	bedrooms?: number
	bathrooms?: number
	property_type?: PropertyType
	location?: string
	amenities?: Array<(typeof AMENITIES)[number]["value"]>
	square_feet?: Range
	year_built?: Range
	lot_size?: Range
	hoa_fees?: Range
	property_tax?: Range
	walk_score?: number
	transit_score?: number
	bike_score?: number
	sortBy?: SortOption
}

// API Filter Interface (for backend queries)
export interface PropertyApiFilters extends PropertyFilters {
	status?: PropertyStatus
	page?: number
	limit?: number
}

// Constants
export const SORT_OPTIONS = {
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
	lot_size_asc: "Lot Size: Low to High",
	lot_size_desc: "Lot Size: High to Low",
	price_per_sqft_asc: "Price per Sqft: Low to High",
	price_per_sqft_desc: "Price per Sqft: High to Low",
	estimate_asc: "Estimate: Low to High",
	estimate_desc: "Estimate: High to Low",
} as const

export const PROPERTY_TYPES: Record<PropertyType, string> = {
	SINGLE_FAMILY_HOME: "Single Family Home",
	APARTMENT: "Apartment",
	CONDO: "Condo",
	TOWNHOUSE: "Townhouse",
	MULTI_FAMILY_HOME: "Multi-Family Home",
	MOBILE_HOME: "Mobile Home",
	LAND: "Land",
	FARM: "Farm",
	FLAT: "Flat",
	COMMERCIAL: "Commercial",
	INDUSTRIAL: "Industrial",
	VACATION_RENTAL: "Vacation Rental",
	OTHER: "Other",
} as const

export const AMENITIES = [
	{ value: "pool", label: "Pool" },
	{ value: "gym", label: "Gym" },
	{ value: "parking", label: "Parking" },
	{ value: "security", label: "Security" },
	{ value: "garden", label: "Garden" },
	{ value: "elevator", label: "Elevator" },
	{ value: "air_conditioning", label: "Air Conditioning" },
	{ value: "heating", label: "Heating" },
	{ value: "laundry", label: "Laundry" },
	{ value: "storage", label: "Storage" },
	{ value: "pets_allowed", label: "Pets Allowed" },
	{ value: "furnished", label: "Furnished" },
] as const
