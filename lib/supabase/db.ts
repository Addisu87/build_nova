import { Property } from "@/types"
import { Database } from "@/types/supabase"
import { supabase } from "./client"

export class DatabaseError extends Error {
	constructor(message: string, public originalError?: unknown) {
		super(message)
		this.name = "DatabaseError"
	}
}

export async function handleSupabaseError<T>(
	operation: () => Promise<{
		data: T | null
		error: unknown
	}>,
): Promise<T> {
	const { data, error } = await operation()

	if (error) {
		throw new DatabaseError(
			error instanceof Error ? error.message : "Unknown error",
			error,
		)
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

export async function getProperties(filters: Partial<Property> = {}) {
	let query = supabase.from("properties").select("*")

	// Apply filters if any
	Object.entries(filters).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			query = query.eq(key, value)
		}
	})

	return handleSupabaseError(() => query)
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
	property: Partial<Omit<Property, "id" | "created_at" | "updated_at">>,
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

type ReservationInput = Omit<
	Database["public"]["Tables"]["reservations"]["Row"],
	"id" | "created_at"
>

export async function createReservation(reservation: ReservationInput) {
	return handleSupabaseError(() =>
		supabase.from("reservations").insert(reservation).select().single(),
	)
}

export async function updateReservation(
	id: string,
	reservation: Partial<ReservationInput>,
) {
	return handleSupabaseError(() =>
		supabase.from("reservations").update(reservation).eq("id", id).select().single(),
	)
}

export async function deleteReservation(id: string) {
	return handleSupabaseError(() => supabase.from("reservations").delete().eq("id", id))
}
