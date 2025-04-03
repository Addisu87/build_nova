import type { Database } from "@/types/supabase"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		"Missing Supabase environment variables. Please check your .env.local file.",
	)
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

const checkStorageAccess = async () => {
	try {
		const { data, error } = await supabase.storage.getBucket('images')
		if (error) {
			console.error('Storage access error:', error)
			throw error
		}
		console.log('Storage bucket info:', data)
	} catch (err) {
		console.error('Failed to access storage:', err)
	}
}

checkStorageAccess()
