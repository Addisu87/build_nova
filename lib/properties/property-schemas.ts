import { PropertyType } from "@/types/properties"
import { z } from "zod"

// Define the Property schema
export const propertySchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	price: z.number().min(0, "Price cannot be negative"),
	bedrooms: z.number().min(0, "Number of bedrooms cannot be negative"),
	bathrooms: z.number().min(0, "Number of bathrooms cannot be negative"),
	squareFootage: z.number().min(0, "Square footage cannot be negative"),
	propertyType: z.nativeEnum(PropertyType),
	yearBuilt: z
		.number()
		.min(1800, "Year must be after 1800")
		.max(new Date().getFullYear(), "Year cannot be in the future"),
})

// Type inference from the schema
export type PropertyFormData = z.infer<typeof propertySchema>
