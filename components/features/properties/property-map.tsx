"use client"

import { LoadingState } from "@/components/ui/loading-state"
import { cn } from "@/lib/utils"
import { Property } from "@/types/properties"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useRef } from "react"

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
const createPriceMarker = (
	price: number,
	isSelected: boolean = false,
) => {
	const formattedPrice =
		price >= 1000000
			? `$${(price / 1000000).toFixed(1)}M`
			: `$${(price / 1000).toFixed(0)}K`

	const markerHtml = `
    <div class="relative flex flex-col items-center">
      <div class="${cn(
				"px-3 py-2 rounded-lg shadow-md font-medium transition-all duration-200",
				isSelected
					? "bg-blue-600 text-white scale-110"
					: "bg-white text-gray-900 hover:scale-105",
			)}">
        ${formattedPrice}
      </div>
      ${
				isSelected
					? `
        <div class="mt-2 text-blue-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `
					: ""
			}
    </div>
  `

	return L.divIcon({
		html: markerHtml,
		className: "custom-price-marker",
		iconSize: null,
		iconAnchor: isSelected ? [40, 64] : [40, 20],
	})
}

export function PropertyMap({
	property,
	nearbyProperties = [],
	isLoading = false,
	className = "",
	height = "h-[600px]",
	onMarkerClick,
	isSelected = false
}: PropertyMapProps) {
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<L.Map | null>(null)
	const markersRef = useRef<L.Marker[]>([])

	useEffect(() => {
		if (typeof window === "undefined") return
		if (!mapRef.current || !property.location) return

		// Initialize map if it hasn't been initialized yet
		if (!mapInstanceRef.current) {
			const map = L.map(mapRef.current, {
				zoomControl: false,
			})
			mapInstanceRef.current = map

			// Add custom zoom control
			L.control
				.zoom({
					position: "bottomright",
				})
				.addTo(map)

			// Add tile layer
			L.tileLayer(
				"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
				{
					attribution: "©OpenStreetMap, ©CartoDB",
				}
			).addTo(map)

			// Calculate bounds for all properties
			const allProperties = [property, ...nearbyProperties].filter(
				(p) => p.location && p.location.lat && p.location.lng
			)
			
			const bounds = L.latLngBounds(
				allProperties.map((p) => [p.location.lat, p.location.lng])
			)

			// Fit map to bounds with padding
			map.fitBounds(bounds, {
				padding: [50, 50],
			})
		}

		const map = mapInstanceRef.current

		// Clear existing markers
		markersRef.current.forEach((marker) => marker.remove())
		markersRef.current = []

		// Add main property marker
		const mainMarker = L.marker(
			[property.location.lat, property.location.lng],
			{
				icon: createPriceMarker(property.price, isSelected),
				riseOnHover: true,
				zIndexOffset: 1000, // Keep selected property marker on top
			}
		).addTo(map)

		if (onMarkerClick) {
			mainMarker.on("click", () => onMarkerClick(property.id))
		}

		markersRef.current.push(mainMarker)

		// Add nearby property markers
		nearbyProperties.forEach((nearbyProperty) => {
			if (nearbyProperty.location && nearbyProperty.location.lat && nearbyProperty.location.lng) {
				const marker = L.marker(
					[nearbyProperty.location.lat, nearbyProperty.location.lng],
					{
						icon: createPriceMarker(nearbyProperty.price, false),
						riseOnHover: true,
					}
				)

				if (onMarkerClick) {
					marker.on("click", () => onMarkerClick(nearbyProperty.id))
				}

				marker.addTo(map)
				markersRef.current.push(marker)
			}
		})

		return () => {
			markersRef.current.forEach((marker) => marker.remove())
			markersRef.current = []
		}
	}, [property, nearbyProperties, isSelected, onMarkerClick])

	if (isLoading || !property || !property.location) {
		return <LoadingState type="map" className={className} height={height} />
	}

	return (
		<div
			ref={mapRef}
			className={cn("w-full rounded-lg overflow-hidden", height, className)}
		/>
	)
}
