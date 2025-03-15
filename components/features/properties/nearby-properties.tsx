"use client"

import { Property } from "@/types/properties"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

interface NearbyPropertiesProps {
  currentProperty: Property
  nearbyProperties: Property[]
}

export function NearbyProperties({ currentProperty, nearbyProperties }: NearbyPropertiesProps) {
  const router = useRouter()

  const formatPrice = (price: number) => {
    return price >= 1000000
      ? `$${(price / 1000000).toFixed(1)}M`
      : `$${(price / 1000).toFixed(0)}K`
  }

  const calculateDistance = (loc1: any, loc2: any) => {
    // This is a simplified version - implement actual distance calculation
    return "0.5 mi away"
  }

  return (
    <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold p-4 border-b flex-shrink-0">
        Nearby Properties
      </h3>
      <div className="overflow-y-auto flex-1">
        <div className="divide-y">
          {nearbyProperties.map((property) => (
            <div
              key={property.id}
              onClick={() => router.push(`/properties/${property.id}`)}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex gap-4">
                {/* Property Image */}
                <div className="relative h-32 w-40 flex-shrink-0">
                  <Image
                    src={property.images?.[0] || property.imageUrl}
                    alt={property.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <Badge 
                    variant={property.status === 'for-sale' ? 'success' : 'secondary'}
                    className="absolute top-2 left-2"
                  >
                    {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                  </Badge>
                </div>

                {/* Property Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className="font-semibold text-lg text-gray-900">
                      {formatPrice(property.price)}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {calculateDistance(currentProperty.location, property.location)}
                    </span>
                  </div>
                  
                  <h5 className="text-base font-medium text-gray-900 truncate mb-1">
                    {property.title}
                  </h5>

                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                    <span>{property.bedrooms} beds</span>
                    <span>•</span>
                    <span>{property.bathrooms} baths</span>
                    <span>•</span>
                    <span>{property.area.toLocaleString()} sqft</span>
                  </div>

                  <p className="text-sm text-gray-600 truncate">
                    {property.location.address}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}