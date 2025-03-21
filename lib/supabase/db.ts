import { Property, PropertyFilters } from "@/types"
import { Database } from "@/types/supabase"
import { supabase } from "./client"

export class DatabaseError extends Error {
	constructor(message: string, public originalError?: any) {
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
		throw new DatabaseError("No data returned from operation")
	}

	return data
}

export async function getProperty(id: string): Promise<Property> {
	return handleSupabaseError(() =>
		supabase.from("properties").select("*").eq("id", id).single(),
	)
}

export async function getProperties(filters?: PropertyFilters): Promise<Property[]> {
	let query = supabase.from("properties").select("*")

	if (filters) {
		if (filters.min_price) {
			query = query.gte("price", filters.min_price)
		}
		if (filters.max_price) {
			query = query.lte("price", filters.max_price)
		}
		if (filters.bedrooms) {
			query = query.eq("bedrooms", filters.bedrooms)
		}
		if (filters.bathrooms) {
			query = query.eq("bathrooms", filters.bathrooms)
		}
		if (filters.property_type) {
			query = query.eq("property_type", filters.property_type)
		}
		if (filters.location) {
			query = query.ilike("location", `%${filters.location}%`)
		}
	}

	return handleSupabaseError(() =>
		query.then((result) => ({
			data: result.data as Property[],
			error: result.error,
		})),
	)
}

export async function createProperty(
	property: Omit<Property, "id" | "created_at" | "updated_at">,
): Promise<Property> {
	return handleSupabaseError(() =>
		supabase.from("properties").insert(property).select().single(),
	)
}

export async function updateProperty(
	id: string,
	property: Partial<Property>,
): Promise<Property> {
	return handleSupabaseError(() =>
		supabase.from("properties").update(property).eq("id", id).select().single(),
	)
}

export async function deleteProperty(id: string): Promise<void> {
	return handleSupabaseError(() => supabase.from("properties").delete().eq("id", id))
}

export async function getFavorites(userId: string) {
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

export async function addFavorite(userId: string, propertyId: string) {
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

export async function removeFavorite(userId: string, propertyId: string) {
	return handleSupabaseError(() =>
		supabase
			.from("favorites")
			.delete()
			.eq("user_id", userId)
			.eq("property_id", propertyId),
	)
}

export async function getReservations(userId: string) {
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
		supabase.from("reservations").insert(reservation).select().single(),
	)
}

export async function updateReservation(
	id: string,
	reservation: Partial<Database["public"]["Tables"]["reservations"]["Row"]>,
) {
	return handleSupabaseError(() =>
		supabase.from("reservations").update(reservation).eq("id", id).select().single(),
	)
}

export async function deleteReservation(id: string) {
	return handleSupabaseError(() => supabase.from("reservations").delete().eq("id", id))
}
