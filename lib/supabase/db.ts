import { Property } from "@/types"
import { Database } from "@/types/supabase"
import { supabaseAdmin } from "./admin-client"
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

export function getProperty(id: string): Promise<Property> {
	return handleSupabaseError(() =>
		supabase.from("properties").select("*").eq("id", id).single(),
	)
}

export function getProperties(filters: Partial<Property> = {}) {
	let query = supabase.from("properties").select("*")

	Object.entries(filters).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			query = query.eq(key, value)
		}
	})

	return handleSupabaseError(() => query)
}

export function createProperty(
	property: Omit<Property, "id" | "created_at" | "updated_at" | "user_id">,
): Promise<Property> {
	return handleSupabaseError(() =>
		supabase.from("properties").insert(property).select().single(),
	)
}

export async function updateProperty(
	userId: string,
	id: string,
	property: Partial<Omit<Property, "id" | "created_at" | "updated_at" | "user_id">>,
	isAdmin: boolean,
): Promise<Property> {
	const { data, error } = await supabase
		.from("properties")
		.update(property)
		.eq("id", id)
		.select()
		.single()

	if (error && isAdmin && supabaseAdmin) {
		return handleSupabaseError(() =>
			supabaseAdmin.from("properties").update(property).eq("id", id).select().single()
		)
	}

	if (error) throw error
	return data as Property
}

export function deleteProperty(id: string, isAdmin: boolean): Promise<void> {
	if (!isAdmin || !supabaseAdmin) {
		return handleSupabaseError(() => 
			supabase.from("properties").delete().eq("id", id)
		)
	}

	return handleSupabaseError(() =>
		supabaseAdmin.from("properties").delete().eq("id", id)
	)
}

export function getFavorites() {
	return handleSupabaseError(() =>
		supabase
			.from("favorites")
			.select(
				`
				id,
				created_at,
				property:properties(*)
			`,
			)
			.order("created_at", { ascending: false }),
	)
}

export function addFavorite(propertyId: string) {
	return handleSupabaseError(() =>
		supabase
			.from("favorites")
			.insert({
				property_id: propertyId,
			})
			.select()
			.single(),
	)
}

export function removeFavorite(propertyId: string) {
	return handleSupabaseError(() =>
		supabase.from("favorites").delete().eq("property_id", propertyId),
	)
}

export function getReservations(userId: string) {
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

export function createReservation(reservation: ReservationInput) {
	return handleSupabaseError(() =>
		supabase.from("reservations").insert(reservation).select().single(),
	)
}

export function updateReservation(id: string, reservation: Partial<ReservationInput>) {
	return handleSupabaseError(() =>
		supabase.from("reservations").update(reservation).eq("id", id).select().single(),
	)
}

export function deleteReservation(id: string) {
	return handleSupabaseError(() => supabase.from("reservations").delete().eq("id", id))
}
