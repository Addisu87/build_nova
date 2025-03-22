export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string | null
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          amenities: string[]
          bathrooms: number
          bedrooms: number
          bike_score: number | null
          city: string
          cooling_type: string | null
          created_at: string | null
          days_on_market: number | null
          description: string
          estimate: number | null
          features: string[]
          heating_type: string | null
          hoa_fees: number | null
          id: string
          images: string[]
          last_sold_date: string | null
          last_sold_price: number | null
          latitude: number
          listing_date: string | null
          longitude: number
          lot_size: number | null
          mls_number: string | null
          parking_spaces: number | null
          price: number
          price_per_square_foot: number | null
          property_tax: number | null
          property_type: Database["public"]["Enums"]["property_type"]
          rent_estimate: number | null
          school_district: string | null
          square_feet: number
          state: string
          status: Database["public"]["Enums"]["property_status"]
          title: string
          transit_score: number | null
          updated_at: string | null
          user_id: string
          walk_score: number | null
          year_built: number
          zip_code: string
        }
        Insert: {
          address: string
          amenities: string[]
          bathrooms: number
          bedrooms: number
          bike_score?: number | null
          city: string
          cooling_type?: string | null
          created_at?: string | null
          days_on_market?: number | null
          description: string
          estimate?: number | null
          features: string[]
          heating_type?: string | null
          hoa_fees?: number | null
          id?: string
          images: string[]
          last_sold_date?: string | null
          last_sold_price?: number | null
          latitude: number
          listing_date?: string | null
          longitude: number
          lot_size?: number | null
          mls_number?: string | null
          parking_spaces?: number | null
          price: number
          price_per_square_foot?: number | null
          property_tax?: number | null
          property_type: Database["public"]["Enums"]["property_type"]
          rent_estimate?: number | null
          school_district?: string | null
          square_feet: number
          state: string
          status: Database["public"]["Enums"]["property_status"]
          title: string
          transit_score?: number | null
          updated_at?: string | null
          user_id: string
          walk_score?: number | null
          year_built: number
          zip_code: string
        }
        Update: {
          address?: string
          amenities?: string[]
          bathrooms?: number
          bedrooms?: number
          bike_score?: number | null
          city?: string
          cooling_type?: string | null
          created_at?: string | null
          days_on_market?: number | null
          description?: string
          estimate?: number | null
          features?: string[]
          heating_type?: string | null
          hoa_fees?: number | null
          id?: string
          images?: string[]
          last_sold_date?: string | null
          last_sold_price?: number | null
          latitude?: number
          listing_date?: string | null
          longitude?: number
          lot_size?: number | null
          mls_number?: string | null
          parking_spaces?: number | null
          price?: number
          price_per_square_foot?: number | null
          property_tax?: number | null
          property_type?: Database["public"]["Enums"]["property_type"]
          rent_estimate?: number | null
          school_district?: string | null
          square_feet?: number
          state?: string
          status?: Database["public"]["Enums"]["property_status"]
          title?: string
          transit_score?: number | null
          updated_at?: string | null
          user_id?: string
          walk_score?: number | null
          year_built?: number
          zip_code?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          property_id: string
          start_date: string
          status: Database["public"]["Enums"]["reservation_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          property_id: string
          start_date: string
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          property_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string
          created_at: string | null
          id: string
          property_id: string
          rating: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: string
          property_id: string
          rating: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: string
          property_id?: string
          rating?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      property_status: "for-sale" | "for-rent" | "sold" | "pending"
      property_type:
        | "SINGLE_FAMILY_HOME"
        | "APARTMENT"
        | "CONDO"
        | "TOWNHOUSE"
        | "STUDIO"
        | "MULTI_FAMILY_HOME"
        | "LAND"
        | "COMMERCIAL"
        | "VACATION_RENTAL"
        | "FARM"
        | "FLAT"
        | "HOTEL"
        | "MEDICAL"
        | "RESTAURANT"
        | "STORAGE"
        | "INDUSTRIAL"
        | "MOBILE_HOME"
        | "MIXED_USE"
        | "OTHER"
      reservation_status: "pending" | "confirmed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
