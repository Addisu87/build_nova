"use client"

import { LoadingState } from "@/components/ui/loading-state"
import { createPriceMarker } from "@/lib/mapbox"
import { cn } from "@/lib/utils"
import { Property } from "@/types"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
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

export function PropertyMap({
	property,
	nearbyProperties = [],
	isLoading = false,
	className = "",
	height = "h-[600px]",
	onMarkerClick,
	isSelected = false,
}: PropertyMapProps) {
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
	const markersRef = useRef<mapboxgl.Marker[]>([])

	useEffect(() => {
		if (typeof window === "undefined") return
		if (!mapRef.current || !property.location) return

		// Initialize map if it hasn't been initialized yet
		if (!mapInstanceRef.current) {
			const map = new mapboxgl.Map({
				container: mapRef.current,
				style: "mapbox://styles/mapbox/light-v11",
				center: [property.location.lng, property.location.lat],
				zoom: 13,
			})

			// Add zoom controls
			map.addControl(
				new mapboxgl.NavigationControl({
					showCompass: false,
				}),
				"bottom-right",
			)

			mapInstanceRef.current = map
		}

		const map = mapInstanceRef.current

		// Clear existing markers
		markersRef.current.forEach((marker) => marker.remove())
		markersRef.current = []

		// Add main property marker
		const mainMarker = new mapboxgl.Marker({
			element: createPriceMarker(property.price, isSelected),
		})
			.setLngLat([property.location.lng, property.location.lat])
			.addTo(map)

		if (onMarkerClick) {
			mainMarker.getElement().addEventListener("click", () => {
				onMarkerClick(property.id)
			})
		}

		markersRef.current.push(mainMarker)

		// Add nearby property markers
		nearbyProperties.forEach((nearbyProperty) => {
			if (nearbyProperty.location) {
				const marker = new mapboxgl.Marker({
					element: createPriceMarker(nearbyProperty.price, false),
				})
					.setLngLat([nearbyProperty.location.lng, nearbyProperty.location.lat])
					.addTo(map)

				if (onMarkerClick) {
					marker.getElement().addEventListener("click", () => {
						onMarkerClick(nearbyProperty.id)
					})
				}

				markersRef.current.push(marker)
			}
		})

		// Fit bounds to include all properties
		const bounds = new mapboxgl.LngLatBounds()
		bounds.extend([property.location.lng, property.location.lat])

		nearbyProperties.forEach((prop) => {
			if (prop.location) {
				bounds.extend([prop.location.lng, prop.location.lat])
			}
		})

		map.fitBounds(bounds, {
			padding: 50,
			maxZoom: 15,
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
