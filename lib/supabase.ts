import { createClient } from "@supabase/supabase-js"
import { Database } from "@/types/database"

const supabaseUrl =
	process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey =
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(
	supabaseUrl,
	supabaseAnonKey,
)

export type Property =
	Database["public"]["Tables"]["properties"]["Row"]
export type NewProperty =
	Database["public"]["Tables"]["properties"]["Insert"]
export type PropertyUpdate =
	Database["public"]["Tables"]["properties"]["Update"]

export type Favorite =
	Database["public"]["Tables"]["favorites"]["Row"]
export type NewFavorite =
	Database["public"]["Tables"]["favorites"]["Insert"]

export type Reservation =
	Database["public"]["Tables"]["reservations"]["Row"]
export type NewReservation =
	Database["public"]["Tables"]["reservations"]["Insert"]
