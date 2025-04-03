import type { Database } from "@/types/supabase"
import { createClient } from "@supabase/supabase-js"
import { supabaseAdmin } from "./admin-client"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		"Missing Supabase environment variables. Please check your .env.local file.",
	)
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

const initializeStorage = async () => {
	try {
		// Use admin client for bucket operations
		const client = supabaseAdmin || supabase

		// Check if bucket exists
		const { data: buckets, error: bucketsError } = await client
			.storage
			.listBuckets()

		if (bucketsError) {
			throw bucketsError
		}

		const imagesBucket = buckets.find(bucket => bucket.id === 'images')

		// If bucket doesn't exist and we have admin access, create it
		if (!imagesBucket && supabaseAdmin) {
			const { data, error } = await supabaseAdmin
				.storage
				.createBucket('images', {
					public: true,
					fileSizeLimit: 5242880, // 5MB
					allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
				})

			if (error) {
				throw error
			}

			console.log('Created storage bucket:', data)
		} else if (!imagesBucket) {
			console.warn('Images bucket does not exist and no admin access to create it')
		} else {
			console.log('Storage bucket exists:', imagesBucket)
		}
	} catch (err) {
		console.error('Storage initialization error:', err)
	}
}

// Initialize storage on client load
initializeStorage()
