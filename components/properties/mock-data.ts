import { Property } from "./types"

export const mockProperties: Property[] = [
	{
		id: "1",
		title: "Modern Downtown Apartment",
		price: 450000,
		location: "Downtown, City",
		bedrooms: 2,
		bathrooms: 2,
		area: 1200,
		imageUrl:
			"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60",
		propertyType: "apartment",
		status: "for-sale",
		yearBuilt: 2020,
		parkingSpaces: 1,
		amenities: [
			"Air Conditioning",
			"Elevator",
			"Gym",
			"Pool",
		],
	},
	{
		id: "2",
		title: "Suburban Family Home",
		price: 650000,
		location: "Suburb Area, City",
		bedrooms: 4,
		bathrooms: 3,
		area: 2400,
		imageUrl:
			"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60",
		propertyType: "house",
		status: "for-sale",
		yearBuilt: 2018,
		lotSize: 5000,
		parkingSpaces: 2,
		amenities: ["Garden", "Garage", "Fireplace"],
	},
	{
		id: "3",
		title: "Luxury Penthouse",
		price: 1200000,
		location: "City Center",
		bedrooms: 3,
		bathrooms: 3,
		area: 2000,
		imageUrl:
			"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
		propertyType: "condo",
		status: "for-sale",
		yearBuilt: 2021,
		parkingSpaces: 2,
		amenities: [
			"Concierge",
			"Rooftop Terrace",
			"Smart Home",
		],
	},
]
