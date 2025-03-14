"use client"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui"
import { ImageCarousel } from "@/components/ui/image-carousel"
import { Property } from "@/types/properties"
import { PropertyMap } from "./property-map"

interface PropertyDetailsModalProps {
	property: Property"use client"

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Property } from "@/types/properties"
import { cn } from "@/lib/utils"
import { PropertyMapSkeleton } from "./map-skeleton"

interface PropertyMapProps {
  property: Property
  nearbyProperties?: Property[]
  isLoading?: boolean
  className?: string
  height?: string
  onMarkerClick?: (propertyId: string) => void
  isSelected?: boolean
}

// Custom price marker creator using Tailwind classes
const createPriceMarker = (price: number, isSelected: boolean = false) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)

  const markerHtml = `
    <div class="${cn(
      'px-3 py-2 rounded-full shadow-md font-medium transition-all duration-200',
      isSelected 
        ? 'bg-primary text-white scale-110' 
        : 'bg-white text-gray-900 hover:scale-105'
    )}">
      ${formattedPrice}
    </div>
  `

  return L.divIcon({
    html: markerHtml,
    className: 'custom-price-marker',
    iconSize: null,
    iconAnchor: [30, 30],
  })
}

export function PropertyMap({
  property,
  nearbyProperties = [],
  isLoading = false,
  className = "",
  height = "h-[300px]",
  onMarkerClick,
  isSelected = false
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return // Check for browser environment
    if (!mapRef.current || !property.location) return

    // Initialize map if it hasn't been initialized yet
    if (!mapInstanceRef.current) {
      const map = new L.Map(mapRef.current)
      mapInstanceRef.current = map

      map.setView(
        [property.location.latitude, property.location.longitude],
        15
      )

      // Add custom zoom control with Tailwind styled buttons
      const zoomControl = new L.Control.Zoom({
        position: 'topright'
      })

      map.addControl(zoomControl)

      // Style zoom controls after they're added to the DOM
      const zoomInButton = mapRef.current.querySelector('.leaflet-control-zoom-in')
      const zoomOutButton = mapRef.current.querySelector('.leaflet-control-zoom-out')
      
      if (zoomInButton && zoomOutButton) {
        zoomInButton.className += ' bg-white hover:bg-gray-100 text-gray-700 shadow-md'
        zoomOutButton.className += ' bg-white hover:bg-gray-100 text-gray-700 shadow-md'
      }

      // Add tile layer
      new L.TileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap, ©CartoDB'
      }).addTo(map)
    }

    const map = mapInstanceRef.current

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add main property marker
    const mainMarker = new L.Marker(
      [property.location.latitude, property.location.longitude],
      {
        icon: createPriceMarker(property.price, isSelected),
        riseOnHover: true
      }
    )

    if (onMarkerClick) {
      mainMarker.on('click', () => onMarkerClick(property.id))
    }

    mainMarker.addTo(map)
    markersRef.current.push(mainMarker)

    // Add nearby property markers
    nearbyProperties.forEach(nearbyProperty => {
      if (nearbyProperty.location) {
        const marker = new L.Marker(
          [nearbyProperty.location.latitude, nearbyProperty.location.longitude],
          {
            icon: createPriceMarker(nearbyProperty.price, false),
            riseOnHover: true
          }
        )

        if (onMarkerClick) {
          marker.on('click', () => onMarkerClick(nearbyProperty.id))
        }

        marker.addTo(map)
        markersRef.current.push(marker)
      }
    })

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      markersRef.current = []
    }
  }, [property, nearbyProperties, isSelected, onMarkerClick])

  if (isLoading) {
    return <PropertyMapSkeleton className={className} height={height} />
  }

  return (
    <div className={cn(
      "relative w-full overflow-hidden rounded-lg",
      height,
      className
    )}>
      <div 
        ref={mapRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}
	isOpen: boolean
	onClose: () => void
}

export function PropertyDetailsModal({
	property,
	isOpen,
	onClose,
}: PropertyDetailsModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>
						{property.title}
					</DialogTitle>
				</DialogHeader>

				<div className="grid gap-6">
					<ImageCarousel
						images={property.images}
						title={property.title}
					/>

					<div className="grid gap-4">
						<div>
							<h3 className="text-lg font-semibold">
								Details
							</h3>
							<div className="mt-2 grid grid-cols-2 gap-4 text-sm">
								<div>
									<span className="font-medium">
										Price:
									</span>{" "}
									$
									{property.price.toLocaleString()}
								</div>
								<div>
									<span className="font-medium">
										Property Type:
									</span>{" "}
									{property.propertyType}
								</div>
								<div>
									<span className="font-medium">
										Bedrooms:
									</span>{" "}
									{property.bedrooms}
								</div>
								<div>
									<span className="font-medium">
										Bathrooms:
									</span>{" "}
									{property.bathrooms}
								</div>
								<div>
									<span className="font-medium">
										Square Feet:
									</span>{" "}
									{property.squareFeet.toLocaleString()}
								</div>
								<div>
									<span className="font-medium">
										Year Built:
									</span>{" "}
									{property.yearBuilt}
								</div>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-semibold">
								Description
							</h3>
							<p className="mt-2 text-sm text-gray-600">
								{property.description}
							</p>
						</div>

						<div>
							<h3 className="text-lg font-semibold">
								Location
							</h3>
							<div className="mt-2">
								<PropertyMap
									property={property}
								/>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
