export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

export interface Database {
	public: {
		Tables: {
			properties: {
				Row: {
					id: string
					created_at: string
					user_id: string
					title: string
					description: string
					price: number
					location: string
					bedrooms: number
					bathrooms: number
					square_feet: number
					property_type: string
					status: string
					images: string[]
					features: string[]
					amenities: string[]
					year_built: number
					last_updated: string
				}
				Insert: Omit<
					Database["public"]["Tables"]["properties"]["Row"],
					"id" | "created_at"
				>
				Update: Partial<
					Database["public"]["Tables"]["properties"]["Insert"]
				>
			}
			favorites: {
				Row: {
					id: string
					created_at: string
					user_id: string
					property_id: string
				}
				Insert: Omit<
					Database["public"]["Tables"]["favorites"]["Row"],
					"id" | "created_at"
				>
				Update: Partial<
					Database["public"]["Tables"]["favorites"]["Insert"]
				>
			}
			reservations: {
				Row: {
					id: string
					created_at: string
					user_id: string
					property_id: string
					start_date: string
					end_date: string
					status: string
					total_price: number
					notes: string | null
				}
				Insert: Omit<
					Database["public"]["Tables"]["reservations"]["Row"],
					"id" | "created_at"
				>
				Update: Partial<
					Database["public"]["Tables"]["reservations"]["Insert"]
				>
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
	}
}
