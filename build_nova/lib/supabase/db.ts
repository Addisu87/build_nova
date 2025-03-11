import { createClient } from "@supabase/supabase-js"
import { Database } from "@/types/supabase"

const supabaseUrl =
	process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey =
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(
	supabaseUrl,
	supabaseAnonKey,
)

export class DatabaseError extends Error {
	constructor(
		message: string,
		public originalError?: any,
	) {
		super(message)
		this.name = "DatabaseError"
	}
}

export async function handleSupabaseError<T>(
	operation: () => Promise<{
		data: T | null
		error: any
	}>,
): Promise<T> {
	const { data, error } = await operation()

	if (error) {
		throw new DatabaseError(error.message, error)
	}

	if (!data) {
		throw new DatabaseError(
			"No data returned from operation",
		)
	}

	return data
}

export async function getProperty(id: string) {
	return handleSupabaseError(() =>
		supabase
			.from("properties")
			.select("*")
			.eq("id", id)
			.single(),
	)
}

export async function getProperties(filters?: {
	minPrice?: number
	maxPrice?: number
	bedrooms?: number
	bathrooms?: number
	propertyType?: string
	location?: string
}) {
	let query = supabase
		.from("properties")
		.select("*")

	if (filters) {
		if (filters.minPrice) {
			query = query.gte("price", filters.minPrice)
		}
		if (filters.maxPrice) {
			query = query.lte("price", filters.maxPrice)
		}
		if (filters.bedrooms) {
			query = query.eq(
				"bedrooms",
				filters.bedrooms,
			)
		}
		if (filters.bathrooms) {
			query = query.eq(
				"bathrooms",
				filters.bathrooms,
			)
		}
		if (filters.propertyType) {
			query = query.eq(
				"property_type",
				filters.propertyType,
			)
		}
		if (filters.location) {
			query = query.ilike(
				"location",
				`%${filters.location}%`,
			)
		}
	}

	return handleSupabaseError(() => query)
}

export async function createProperty(
	property: Omit<
		Database["public"]["Tables"]["properties"]["Row"],
		"id" | "created_at"
	>,
) {
	return handleSupabaseError(() =>
		supabase
			.from("properties")
			.insert(property)
			.select()
			.single(),
	)
}

export async function updateProperty(
	id: string,
	property: Partial<
		Database["public"]["Tables"]["properties"]["Row"]
	>,
) {
	return handleSupabaseError(() =>
		supabase
			.from("properties")
			.update(property)
			.eq("id", id)
			.select()
			.single(),
	)
}

export async function deleteProperty(id: string) {
	return handleSupabaseError(() =>
		supabase
			.from("properties")
			.delete()
			.eq("id", id),
	)
}

export async function getFavorites(
	userId: string,
) {
	return handleSupabaseError(() =>
		supabase
			.from("favorites")
			.select(
				`
        property:properties(*)
      `,
			)
			.eq("user_id", userId),
	)
}

export async function addFavorite(
	userId: string,
	propertyId: string,
) {
	return handleSupabaseError(() =>
		supabase
			.from("favorites")
			.insert({
				user_id: userId,
				property_id: propertyId,
			})
			.select()
			.single(),
	)
}

export async function removeFavorite(
	userId: string,
	propertyId: string,
) {
	return handleSupabaseError(() =>
		supabase
			.from("favorites")
			.delete()
			.eq("user_id", userId)
			.eq("property_id", propertyId),
	)
}

export async function getReservations(
	userId: string,
) {
	return handleSupabaseError(() =>
		supabase
			.from("reservations")
			.select(
				`
        property:properties(*)
      `,
			)
			.eq("user_id", userId),
	)
}

export async function createReservation(
	reservation: Omit<
		Database["public"]["Tables"]["reservations"]["Row"],
		"id" | "created_at"
	>,
) {
	return handleSupabaseError(() =>
		supabase
			.from("reservations")
			.insert(reservation)
			.select()
			.single(),
	)
}

export async function updateReservation(
	id: string,
	reservation: Partial<
		Database["public"]["Tables"]["reservations"]["Row"]
	>,
) {
	return handleSupabaseError(() =>
		supabase
			.from("reservations")
			.update(reservation)
			.eq("id", id)
			.select()
			.single(),
	)
}

export async function deleteReservation(
	id: string,
) {
	return handleSupabaseError(() =>
		supabase
			.from("reservations")
			.delete()
			.eq("id", id),
	)
}
