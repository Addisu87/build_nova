"use client"

import { PropertyMap } from "@/components/features/properties/property-map"
import { PropertiesGrid } from "@/components/features/properties/property-grid"
import { PropertyFilters } from "@/components/features/properties/property-filters"
import { usePropertyManager } from "@/hooks/properties/use-property-manager"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const listingType = searchParams.get("type") // 'buy' or 'rent'
  const { properties, updateFilters } = usePropertyManager()

  useEffect(() => {
    updateFilters({
      listingType: listingType as "buy" | "rent"
    })
  }, [listingType, updateFilters])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filters Bar */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <PropertyFilters 
            onFiltersChange={updateFilters}
            initialFilters={{ listingType: listingType as "buy" | "rent" }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Map Section */}
          <div className="w-[45%] sticky top-24 h-[calc(100vh-6rem)]">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <PropertyMap
                properties={properties}
                zoom={12}
                height="h-full"
                onMarkerClick={(propertyId) => {
                  window.location.href = `/properties/${propertyId}`
                }}
              />
            </div>
          </div>

          {/* Properties Grid Section */}
          <div className="w-[55%]">
            <PropertiesGrid properties={properties} />
          </div>
        </div>
      </div>
    </div>
  )
}