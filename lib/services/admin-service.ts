import { supabase } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

const SUPER_ADMIN = {
	email: "addisuhaile87@gmail.com",
	id: "ea5bcfd3-da7d-4657-ba78-197a5d25ba97",
}

export class AdminService {
	static async isAdmin(user: User | null): Promise<boolean> {
		if (!user) return false

		// Check if user is the super admin
		if (user.email === SUPER_ADMIN.email && user.id === SUPER_ADMIN.id) {
			return true
		}

		try {
			const {
				data: { user: userData },
			} = await supabase.auth.getUser()
			return userData?.user_metadata?.role === "admin"
		} catch (error) {
			console.error("Error checking admin status:", error)
			return false
		}
	}

	static isSuperAdmin(user: User | null): boolean {
		if (!user) return false
		return user.email === SUPER_ADMIN.email && user.id === SUPER_ADMIN.id
	}

	static async setAdminRole(userId: string, isAdmin: boolean) {
		try {
			// Prevent modifying super admin's role
			if (userId === SUPER_ADMIN.id) {
				throw new Error("Cannot modify super admin's role")
			}

			const { error } = await supabase.auth.admin.updateUserById(userId, {
				user_metadata: { role: isAdmin ? "admin" : "user" },
			})

			if (error) throw error
			return true
		} catch (error) {
			console.error("Error updating admin role:", error)
			return false
		}
	}

	static async getAdminUsers() {
		try {
			const {
				data: { users },
				error,
			} = await supabase.auth.admin.listUsers()
			if (error) throw error

			// Include both super admin and users with admin role
			return users.filter(
				(user) =>
					(user.email === SUPER_ADMIN.email && user.id === SUPER_ADMIN.id) ||
					user.user_metadata?.role === "admin",
			)
		} catch (error) {
			console.error("Error fetching admin users:", error)
			return []
		}
	}
}
