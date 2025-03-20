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
					title: string
					description: string
					price: number
					bedrooms: number
					bathrooms: number
					square_feet: number
					property_type: string
					status: string
					address: string
					city: string
					state: string
					zip_code: string
					latitude: number
					longitude: number
					images: string[]
					imageUrl: string
					features: string[]
					status: "for-sale" | "for-rent" | "sold" | "pending"
					property_type: string
					amenities: string[]
					year_built: number
					lot_size?: number
					parking_spaces?: number
					heating_type?: string
					cooling_type?: string
					hoa_fees?: number
					property_tax?: number
					mls_number?: string
					listing_date?: string
					days_on_market?: number
					school_district?: string
					walk_score?: number
					transit_score?: number
					bike_score?: number
					price_per_square_foot?: number
					estimate?: number
					rent_estimate?: number
					last_sold_price?: number
					last_sold_date?: string
					user_id: string
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
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
					status?: "for-sale" | "for-rent" | "sold" | "pending"
					property_type: string
					amenities: string[]
					year_built: number
					lot_size?: number
					parking_spaces?: number
					heating_type?: string
					cooling_type?: string
					hoa_fees?: number
					property_tax?: number
					mls_number?: string
					listing_date?: string
					days_on_market?: number
					school_district?: string
					walk_score?: number
					transit_score?: number
					bike_score?: number
					price_per_square_foot?: number
					estimate?: number
					rent_estimate?: number
					last_sold_price?: number
					last_sold_date?: string
					user_id: string
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
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
					status?: "for-sale" | "for-rent" | "sold" | "pending"
					property_type?: string
					amenities?: string[]
					year_built?: number
					lot_size?: number
					parking_spaces?: number
					heating_type?: string
					cooling_type?: string
					hoa_fees?: number
					property_tax?: number
					mls_number?: string
					listing_date?: string
					days_on_market?: number
					school_district?: string
					walk_score?: number
					transit_score?: number
					bike_score?: number
					price_per_square_foot?: number
					estimate?: number
					rent_estimate?: number
					last_sold_price?: number
					last_sold_date?: string
					user_id?: string
					created_at?: string
					updated_at?: string
				}
			}
			favorites: {
				Row: {
					id: string
					user_id: string
					property_id: string
					created_at: string
				}
				Insert: {
					id?: string
					user_id: string
					property_id: string
					created_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					property_id?: string
					created_at?: string
				}
			}
			reservations: {
				Row: {
					id: string
					user_id: string
					property_id: string
					start_date: string
					end_date: string
					status: "pending" | "confirmed" | "cancelled"
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					user_id: string
					property_id: string
					start_date: string
					end_date: string
					status?: "pending" | "confirmed" | "cancelled"
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					property_id?: string
					start_date?: string
					end_date?: string
					status?: "pending" | "confirmed" | "cancelled"
					created_at?: string
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
