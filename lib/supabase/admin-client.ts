import type { Database } from "@/types/supabase"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Only create admin client if service role key is available
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
	? createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		})
	: null

// Helper function to check if admin client is available
export function hasAdminAccess(): boolean {
	return !!supabaseAdmin
}
