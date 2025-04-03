-- schema.sql
-- Database schema for property management system
-- Last updated: March 22, 2025

-- Enable UUID extension (Supabase uses UUIDs by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Property Status Enum
CREATE TYPE property_status AS ENUM ('for-sale', 'for-rent', 'sold', 'pending');

-- Property Type Enum
CREATE TYPE property_type AS ENUM (
  'SINGLE_FAMILY_HOME',
  'APARTMENT',
  'CONDO',
  'TOWNHOUSE',
  'STUDIO',
  'MULTI_FAMILY_HOME',
  'LAND',
  'COMMERCIAL',
  'VACATION_RENTAL',
  'FARM',
  'FLAT',
  'HOTEL',
  'MEDICAL',
  'RESTAURANT',
  'STORAGE',
  'INDUSTRIAL',
  'MOBILE_HOME',
  'MIXED_USE',
  'OTHER'
);

-- Properties Table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  square_feet INTEGER NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  images TEXT[] NOT NULL,
  features TEXT[] NOT NULL,
  status property_status NOT NULL,
  property_type property_type NOT NULL,
  amenities TEXT[] NOT NULL,
  year_built INTEGER NOT NULL,
  lot_size INTEGER,
  parking_spaces INTEGER,
  heating_type TEXT,
  cooling_type TEXT,
  hoa_fees NUMERIC,
  property_tax NUMERIC,
  mls_number TEXT,
  listing_date TIMESTAMP,
  days_on_market INTEGER,
  school_district TEXT,
  walk_score INTEGER,
  transit_score INTEGER,
  bike_score INTEGER,
  price_per_square_foot NUMERIC,
  estimate NUMERIC,
  rent_estimate NUMERIC,
  last_sold_price NUMERIC,
  last_sold_date TIMESTAMP,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public properties are viewable by everyone"
  ON properties FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties"
  ON properties FOR DELETE
  USING (auth.uid() = user_id);

-- Favorites Table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, property_id)
);

-- Add RLS policies for favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Reservation Status Enum
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled');

-- Reservations Table
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status reservation_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, property_id)
);

-- Add RLS policies for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_location ON properties(city, state, zip_code);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_reservations_property_id ON reservations(property_id);
CREATE INDEX idx_reviews_property_id ON reviews(property_id);

-- Trigger Function for updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_timestamp
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_reservations_timestamp
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_reviews_timestamp
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();
