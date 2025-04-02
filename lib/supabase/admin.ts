import { supabase } from "./client"
import { DatabaseError } from "./db"

export async function isFirstUser(): Promise<boolean> {
	const { count } = await supabase
		.from("users")
		.select("*", { count: "exact", head: true })

	return count === 0
}

export async function setAdminRole(userId: string) {
	const { data, error } = await supabase.auth.admin.updateUserById(userId, {
		user_metadata: { role: "admin" },
	})

	if (error) {
		throw error
	}

	return data
}

export async function getAdminCount(): Promise<number> {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("user_metadata->role", "admin")

	if (error) throw new DatabaseError("Failed to get admin count", error)

	return data?.length || 0
}
