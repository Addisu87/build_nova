"use client"

import { cn } from "@/lib/utils"
import { Property } from "@/types/properties"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useRef } from "react"
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
const createPriceMarker = (
	price: number,
	isSelected: boolean = false,
) => {
	const formattedPrice = new Intl.NumberFormat(
		"en-US",
		{
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		},
	).format(price)

	const markerHtml = `
    <div class="${cn(
			"px-3 py-2 rounded-full shadow-md font-medium transition-all duration-200",
			isSelected
				? "bg-primary text-white scale-110"
				: "bg-white text-gray-900 hover:scale-105",
		)}">
      ${formattedPrice}
    </div>
  `

	return L.divIcon({
		html: markerHtml,
		className: "custom-price-marker",
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
	isSelected = false,
}: PropertyMapProps) {
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<L.Map | null>(
		null,
	)
	const markersRef = useRef<L.Marker[]>([])

	useEffect(() => {
		if (typeof window === "undefined") return // Check for browser environment
		if (!mapRef.current || !property.location)
			return

		// Initialize map if it hasn't been initialized yet
		if (!mapInstanceRef.current) {
			const map = new L.Map(mapRef.current)
			mapInstanceRef.current = map

			map.setView(
				[
					property.location.lat,
					property.location.lng,
				],
				15,
			)

			// Add custom zoom control with Tailwind styled buttons
			const zoomControl = new L.Control.Zoom({
				position: "topright",
			})

			map.addControl(zoomControl)

			// Style zoom controls after they're added to the DOM
			const zoomInButton =
				mapRef.current.querySelector(
					".leaflet-control-zoom-in",
				)
			const zoomOutButton =
				mapRef.current.querySelector(
					".leaflet-control-zoom-out",
				)

			if (zoomInButton && zoomOutButton) {
				zoomInButton.className +=
					" bg-white hover:bg-gray-100 text-gray-700 shadow-md"
				zoomOutButton.className +=
					" bg-white hover:bg-gray-100 text-gray-700 shadow-md"
			}

			// Add tile layer
			new L.TileLayer(
				"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
				{
					attribution: "©OpenStreetMap, ©CartoDB",
				},
			).addTo(map)
		}

		const map = mapInstanceRef.current

		// Clear existing markers
		markersRef.current.forEach((marker) =>
			marker.remove(),
		)
		markersRef.current = []

		// Add main property marker
		const mainMarker = new L.Marker(
			[
				property.location.lat,
				property.location.lng,
			],
			{
				icon: createPriceMarker(
					property.price,
					isSelected,
				),
				riseOnHover: true,
			},
		)

		if (onMarkerClick) {
			mainMarker.on("click", () =>
				onMarkerClick(property.id),
			)
		}

		mainMarker.addTo(map)
		markersRef.current.push(mainMarker)

		// Add nearby property markers
		nearbyProperties.forEach((nearbyProperty) => {
			if (nearbyProperty.location) {
				const marker = new L.Marker(
					[
						nearbyProperty.location.lat,
						nearbyProperty.location.lng,
					],
					{
						icon: createPriceMarker(
							nearbyProperty.price,
							false,
						),
						riseOnHover: true,
					},
				)

				if (onMarkerClick) {
					marker.on("click", () =>
						onMarkerClick(nearbyProperty.id),
					)
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
	}, [
		property,
		nearbyProperties,
		isSelected,
		onMarkerClick,
	])

	if (isLoading) {
		return (
			<PropertyMapSkeleton
				className={className}
				height={height}
			/>
		)
	}

	return (
		<div
			className={cn(
				"relative w-full overflow-hidden rounded-lg",
				height,
				className,
			)}
		>
			<div
				ref={mapRef}
				className="absolute inset-0 w-full h-full"
			/>
		</div>
	)
}
