import { Property, PropertyType } from "./types"

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
		propertyType: PropertyType.Apartment,
		createdAt: "2024-03-15T10:00:00Z",
		updatedAt: "2024-03-15T10:00:00Z",
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
		propertyType: PropertyType.House,
		createdAt: "2024-03-14T15:30:00Z",
		updatedAt: "2024-03-14T15:30:00Z",
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
		propertyType: PropertyType.Condo,
		createdAt: "2024-03-13T09:15:00Z",
		updatedAt: "2024-03-13T09:15:00Z",
	},
	{
		id: "4",
		title: "Modern Townhouse",
		price: 550000,
		location: "Urban District",
		bedrooms: 3,
		bathrooms: 2.5,
		area: 1800,
		imageUrl:
			"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=60",
		propertyType: PropertyType.Townhouse,
		createdAt: "2024-03-12T14:45:00Z",
		updatedAt: "2024-03-12T14:45:00Z",
	},
	{
		id: "5",
		title: "Premium Building Land",
		price: 300000,
		location: "Developing Area",
		bedrooms: 0,
		bathrooms: 0,
		area: 5000,
		imageUrl:
			"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60",
		propertyType: PropertyType.Land,
		createdAt: "2024-03-11T11:20:00Z",
		updatedAt: "2024-03-11T11:20:00Z",
	},
]
