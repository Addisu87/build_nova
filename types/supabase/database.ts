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
					title: string
					description: string
					price: number
					bedrooms: number
					bathrooms: number
					square_feet: number
					address: string
					city: string
					state: string
					zip_code: string
					latitude: number
					longitude: number
					images: string[]
					features: string[]
					status: "available" | "pending" | "sold"
					user_id: string
					updated_at: string
				}
				Insert: {
					id?: string
					created_at?: string
					title: string
					description: string
					price: number
					bedrooms: number
					bathrooms: number
					square_feet: number
					address: string
					city: string
					state: string
					zip_code: string
					latitude: number
					longitude: number
					images: string[]
					features: string[]
					status?:
						| "available"
						| "pending"
						| "sold"
					user_id: string
					updated_at?: string
				}
				Update: {
					id?: string
					created_at?: string
					title?: string
					description?: string
					price?: number
					bedrooms?: number
					bathrooms?: number
					square_feet?: number
					address?: string
					city?: string
					state?: string
					zip_code?: string
					latitude?: number
					longitude?: number
					images?: string[]
					features?: string[]
					status?:
						| "available"
						| "pending"
						| "sold"
					user_id?: string
					updated_at?: string
				}
			}
			favorites: {
				Row: {
					id: string
					created_at: string
					user_id: string
					property_id: string
				}
				Insert: {
					id?: string
					created_at?: string
					user_id: string
					property_id: string
				}
				Update: {
					id?: string
					created_at?: string
					user_id?: string
					property_id?: string
				}
			}
			reservations: {
				Row: {
					id: string
					created_at: string
					user_id: string
					property_id: string
					start_date: string
					end_date: string
					status:
						| "pending"
						| "confirmed"
						| "cancelled"
					updated_at: string
				}
				Insert: {
					id?: string
					created_at?: string
					user_id: string
					property_id: string
					start_date: string
					end_date: string
					status?:
						| "pending"
						| "confirmed"
						| "cancelled"
					updated_at?: string
				}
				Update: {
					id?: string
					created_at?: string
					user_id?: string
					property_id?: string
					start_date?: string
					end_date?: string
					status?:
						| "pending"
						| "confirmed"
						| "cancelled"
					updated_at?: string
				}
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
