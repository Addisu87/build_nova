import { PROPERTY_TYPES } from "@/types"
import { z } from "zod"

// Define the Property schema
export const propertySchema = z.object({
	// Basic Information
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	price: z.number().min(0, "Price must be greater than 0"),

	// Property Details
	bedrooms: z.number().min(0, "Number of bedrooms cannot be negative"),
	bathrooms: z.number().min(0, "Number of bathrooms cannot be negative"),
	square_feet: z.number().min(0, "Square footage cannot be negative"),
	property_type: z.enum(Object.keys(PROPERTY_TYPES) as [string, ...string[]]),
	year_built: z
		.number()
		.min(1800, "Year must be after 1800")
		.max(new Date().getFullYear(), "Year cannot be in the future"),

	// Location
	address: z.string().min(1, "Address is required"),
	city: z.string().min(1, "City is required"),
	state: z.string().min(1, "State is required"),
	zip_code: z.string().min(1, "ZIP code is required"),
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),

	// Features and Amenities
	images: z.array(z.string()).default([]),
	features: z.array(z.string()).default([]),
	amenities: z.array(z.string()).default([]),

	// Status and Type
	status: z
		.enum(["for-sale", "for-rent", "sold", "pending"] as const)
		.default("for-sale"),

	// Additional Details
	lot_size: z.number().min(0).nullable().optional(),
	parking_spaces: z.number().min(0).nullable().optional(),
	heating_type: z.string().nullable().optional(),
	cooling_type: z.string().nullable().optional(),

	// Financial Details
	hoa_fees: z.number().min(0).nullable().optional(),
	property_tax: z.number().min(0).nullable().optional(),
	price_per_square_foot: z.number().min(0).nullable().optional(),
	estimate: z.number().min(0).nullable().optional(),
	rent_estimate: z.number().min(0).nullable().optional(),
	last_sold_price: z.number().min(0).nullable().optional(),

	// Listing Information
	mls_number: z.string().nullable().optional(),
	listing_date: z.string().nullable().optional(),
	days_on_market: z.number().min(0).nullable().optional(),
	last_sold_date: z.string().nullable().optional(),

	// Location Scores
	school_district: z.string().nullable().optional(),
	walk_score: z.number().min(0).max(100).nullable().optional(),
	transit_score: z.number().min(0).max(100).nullable().optional(),
	bike_score: z.number().min(0).max(100).nullable().optional(),
})

// Type inference from the schema
export type PropertyFormData = z.infer<typeof propertySchema>

// Partial schema for updates
export const propertyUpdateSchema = propertySchema.partial()
export type PropertyUpdateData = z.infer<typeof propertyUpdateSchema>

// Schema for property search/filters
export const propertyFilterSchema = z.object({
	min_price: z.number().optional(),
	max_price: z.number().optional(),
	bedrooms: z.number().optional(),
	bathrooms: z.number().optional(),
	min_square_feet: z.number().optional(),
	max_square_feet: z.number().optional(),
	property_type: z
		.enum(Object.keys(PROPERTY_TYPES) as [string, ...string[]])
		.optional(),
	status: z.enum(["for-sale", "for-rent", "sold", "pending"] as const).optional(),
	location: z.string().optional(),
	year_built_min: z.number().optional(),
	year_built_max: z.number().optional(),
})

export type PropertyFilterData = z.infer<typeof propertyFilterSchema>
