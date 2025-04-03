import { AdminService } from "@/lib/services/admin-service"
import { User } from "@supabase/supabase-js"

export function useAdminStatus(user: User | null) {
	return {
		isAdmin: user?.user_metadata?.role === "admin" || AdminService.isSuperAdmin(user),
	}
}
