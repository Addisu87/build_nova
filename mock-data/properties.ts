import { Database } from "@/types/supabase"

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"]

export const mockProperties: PropertyRow[] = [
	{
		id: "1",
		title: "Modern Downtown Apartment",
		description: "Luxurious apartment with stunning city views and modern amenities",
		price: 450000,
		bedrooms: 2,
		bathrooms: 2,
		square_feet: 1200,
		address: "123 Market Street",
		city: "San Francisco",
		state: "CA",
		zip_code: "94105",
		latitude: 37.7929,
		longitude: -122.3971,
		images: [
			"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60", // Main view
			"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60", // Living room
			"https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&auto=format&fit=crop&q=60", // Kitchen
			"https://images.unsplash.com/photo-1560448082-4d5eb87d6d4b?w=800&auto=format&fit=crop&q=60", // Bedroom
			"https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&auto=format&fit=crop&q=60", // Bathroom
			"https://images.unsplash.com/photo-1560448087-cfe556c9035d?w=800&auto=format&fit=crop&q=60", // Balcony
		],
		features: ["Open Floor Plan", "Hardwood Floors", "Stainless Steel Appliances"],
		property_type: "apartment",
		status: "for-sale",
		amenities: ["Air Conditioning", "Elevator", "Gym", "Pool"],
		year_built: 2020,
		lot_size: undefined,
		parking_spaces: 1,
		heating_type: "central",
		cooling_type: "central",
		hoa_fees: 500,
		property_tax: 5000,
		mls_number: "SF123456",
		listing_date: new Date().toISOString(),
		days_on_market: 0,
		school_district: "San Francisco Unified",
		walk_score: 95,
		transit_score: 90,
		bike_score: 85,
		price_per_square_foot: 375,
		estimate: 460000,
		rent_estimate: 3500,
		last_sold_price: undefined,
		last_sold_date: undefined,
		user_id: "user123",
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: "2",
		title: "Suburban Family Home",
		description: "Spacious family home with large backyard and modern updates",
		price: 850000,
		bedrooms: 4,
		bathrooms: 3,
		square_feet: 2400,
		address: "456 Oak Avenue",
		city: "Oakland",
		state: "CA",
		zip_code: "94601",
		latitude: 37.8060,
		longitude: -122.4103,
		images: [
			"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60", // Front view
			"https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop&q=60", // Back yard
			"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60", // Living room
			"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=60", // Kitchen
			"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop&q=60", // Master bedroom
			"https://images.unsplash.com/photo-1600566752734-2a0cd66c42cb?w=800&auto=format&fit=crop&q=60", // Bathroom
			"https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&auto=format&fit=crop&q=60", // Garden
		],
		features: ["Updated Kitchen", "Master Suite", "Large Backyard"],
		property_type: "house",
		status: "for-sale",
		amenities: ["Garden", "Garage", "Fireplace"],
		year_built: 2015,
		lot_size: 6000,
		parking_spaces: 2,
		heating_type: "forced air",
		cooling_type: "central",
		hoa_fees: undefined,
		property_tax: 8500,
		mls_number: "OAK789012",
		listing_date: new Date().toISOString(),
		days_on_market: 5,
		school_district: "Oakland Unified",
		walk_score: 75,
		transit_score: 65,
		bike_score: 70,
		price_per_square_foot: 354,
		estimate: 860000,
		rent_estimate: 4200,
		last_sold_price: 750000,
		last_sold_date: "2020-06-15",
		user_id: "user123",
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: "3",
		title: "Luxury Penthouse",
		description: "Stunning penthouse with panoramic views and high-end finishes",
		price: 1200000,
		bedrooms: 3,
		bathrooms: 3.5,
		square_feet: 2000,
		address: "789 Pine Street",
		city: "San Francisco",
		state: "CA",
		zip_code: "94108",
		latitude: 37.8010,
		longitude: -122.4194,
		images: [
			"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60", // Exterior view
			"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=60", // Living area
			"https://images.unsplash.com/photo-1600607687101-e53f41cb1d50?w=800&auto=format&fit=crop&q=60", // Kitchen
			"https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&auto=format&fit=crop&q=60", // Master bedroom
			"https://images.unsplash.com/photo-1600607687644-c7171b42498d?w=800&auto=format&fit=crop&q=60", // Bathroom
			"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60", // View
			"https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&auto=format&fit=crop&q=60", // Wine room
		],
		features: ["Floor-to-Ceiling Windows", "Custom Cabinetry", "Wine Cellar"],
		property_type: "condo",
		status: "for-sale",
		amenities: ["Concierge", "Rooftop Terrace", "Smart Home", "Wine Room"],
		year_built: 2021,
		lot_size: undefined,
		parking_spaces: 2,
		heating_type: "radiant",
		cooling_type: "central",
		hoa_fees: 1200,
		property_tax: 12000,
		mls_number: "SF345678",
		listing_date: new Date().toISOString(),
		days_on_market: 10,
		school_district: "San Francisco Unified",
		walk_score: 98,
		transit_score: 95,
		bike_score: 75,
		price_per_square_foot: 600,
		estimate: 1250000,
		rent_estimate: 7500,
		last_sold_price: undefined,
		last_sold_date: undefined,
		user_id: "user123",
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: "4",
		title: "Modern Townhouse",
		description:
			"Contemporary townhouse with smart home features and urban convenience",
		price: 550000,
		bedrooms: 3,
		bathrooms: 2.5,
		square_feet: 1800,
		address: "101 Birch Lane",
		city: "San Francisco",
		state: "CA",
		zip_code: "94108",
		latitude: 37.7925,
		longitude: -122.4147,
		images: [
			"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=60", // Front view
			"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop&q=60", // Living room
			"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=60", // Kitchen
			"https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&auto=format&fit=crop&q=60", // Bedroom
			"https://images.unsplash.com/photo-1600566752734-2a0cd66c42cb?w=800&auto=format&fit=crop&q=60", // Bathroom
		],
		features: ["Smart Home System", "Modern Design", "Energy Efficient"],
		property_type: "townhouse",
		status: "for-sale",
		amenities: ["Smart Home", "Garage", "Rooftop Deck"],
		year_built: 2019,
		lot_size: undefined,
		parking_spaces: 1,
		heating_type: "forced air",
		cooling_type: "central",
		hoa_fees: 350,
		property_tax: 6000,
		mls_number: "SF567890",
		listing_date: new Date().toISOString(),
		days_on_market: 15,
		school_district: "San Francisco Unified",
		walk_score: 92,
		transit_score: 88,
		bike_score: 80,
		price_per_square_foot: 305,
		estimate: 565000,
		rent_estimate: 3200,
		last_sold_price: undefined,
		last_sold_date: undefined,
		user_id: "user123",
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: "5",
		title: "Premium Building Land",
		description: "Prime development opportunity in growing neighborhood",
		price: 300000,
		bedrooms: 0,
		bathrooms: 0,
		square_feet: 5000,
		address: "202 Maple Road",
		city: "San Francisco",
		state: "CA",
		zip_code: "94109",
		latitude: 37.7925,
		longitude: -122.4382,
		images: [
			"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60", // Aerial view
			"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60", // Street view
			"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60", // Plot map
		],
		features: ["Corner Lot", "Utilities Ready", "Zoned Residential"],
		property_type: "land",
		status: "for-sale",
		amenities: [],
		year_built: 0,
		lot_size: 5000,
		parking_spaces: 0,
		heating_type: undefined,
		cooling_type: undefined,
		hoa_fees: undefined,
		property_tax: 3000,
		mls_number: "SF789012",
		listing_date: new Date().toISOString(),
		days_on_market: 30,
		school_district: "San Francisco Unified",
		walk_score: 85,
		transit_score: 80,
		bike_score: 75,
		price_per_square_foot: 60,
		estimate: 310000,
		rent_estimate: undefined,
		last_sold_price: undefined,
		last_sold_date: undefined,
		user_id: "user123",
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: "6",
		title: "Modern Downtown Apartment",
		description: "Luxurious downtown living with stunning city views",
		price: 450000,
		bedrooms: 2,
		bathrooms: 2,
		square_feet: 1200,
		address: "303 Walnut Street",
		city: "San Francisco",
		state: "CA",
		zip_code: "94110",
		latitude: 37.8037,
		longitude: -122.4368,
		images: [
			"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60", // Main view
			"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60", // City view
		],
		features: ["City Views", "Modern Appliances", "Open Floor Plan"],
		property_type: "apartment",
		status: "for-sale",
		amenities: ["Air Conditioning", "Elevator", "Gym", "Pool"],
		year_built: 2020,
		lot_size: undefined,
		parking_spaces: 1,
		heating_type: "forced air",
		cooling_type: "central",
		hoa_fees: 500,
		property_tax: 4500,
		mls_number: "SF901234",
		listing_date: new Date().toISOString(),
		days_on_market: 5,
		school_district: "San Francisco Unified",
		walk_score: 95,
		transit_score: 98,
		bike_score: 85,
		price_per_square_foot: 375,
		estimate: 460000,
		rent_estimate: 2800,
		last_sold_price: undefined,
		last_sold_date: undefined,
		user_id: "user123",
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: "7",
		title: "Suburban Family Home",
		description: "Spacious family home in quiet suburban neighborhood",
		price: 650000,
		bedrooms: 4,
		bathrooms: 3,
		square_feet: 2400,
		address: "404 Oak Street",
		city: "San Francisco",
		state: "CA",
		zip_code: "94111",
		latitude: 37.7759,
		longitude: -122.4245,
		images: [
			"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60", // Front view
			"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60", // Back yard
		],
		features: ["Large Backyard", "Updated Kitchen", "Master Suite"],
		property_type: "house",
		status: "for-sale",
		amenities: ["Garden", "Garage", "Fireplace"],
		year_built: 2018,
		lot_size: 5000,
		parking_spaces: 2,
		heating_type: "forced air",
		cooling_type: "central",
		hoa_fees: undefined,
		property_tax: 7200,
		mls_number: "SF123456",
		listing_date: new Date().toISOString(),
		days_on_market: 20,
		school_district: "San Francisco Unified",
		walk_score: 75,
		transit_score: 70,
		bike_score: 65,
		price_per_square_foot: 270,
		estimate: 660000,
		rent_estimate: 3800,
		last_sold_price: undefined,
		last_sold_date: undefined,
		user_id: "user123",
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: "8",
		title: "Luxury Penthouse",
		description: "Exclusive penthouse with panoramic city views",
		price: 1200000,
		bedrooms: 3,
		bathrooms: 3,
		square_feet: 2000,
		address: "505 Pine Street",
		city: "San Francisco",
		state: "CA",
		zip_code: "94112",
		latitude: 37.7599,
		longitude: -122.4148,
		images: [
			"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60", // Exterior view
			"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60", // Living area
		],
		features: ["Panoramic Views", "Custom Finishes", "Private Elevator"],
		property_type: "condo",
		status: "for-sale",
		amenities: ["Concierge", "Rooftop Terrace", "Smart Home"],
		year_built: 2021,
		lot_size: undefined,
		parking_spaces: 2,
		heating_type: "forced air",
		cooling_type: "central",
		hoa_fees: 1000,
		property_tax: 14400,
		mls_number: "SF345678",
		listing_date: new Date().toISOString(),
		days_on_market: 10,
		school_district: "San Francisco Unified",
		walk_score: 98,
		transit_score: 95,
		bike_score: 80,
		price_per_square_foot: 600,
		estimate: 1250000,
		rent_estimate: 7000,
		last_sold_price: undefined,
		last_sold_date: undefined,
		user_id: "user123",
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
]
