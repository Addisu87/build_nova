"use client"

import { Property } from "@/types/properties"
import { Loader } from "lucide-react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { useEffect, useRef } from "react"

interface PropertyMapProps {
	property: Property
	isLoading?: boolean
}

export function PropertyMap({
	property,
	isLoading = false,
}: PropertyMapProps) {
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef =
		useRef<maplibregl.Map | null>(null)
	const markerRef =
		useRef<maplibregl.Marker | null>(null)

	useEffect(() => {
		if (!mapRef.current || !property.location)
			return

		// Parse location string to coordinates (assuming format: "lat,lng")
		const [lat, lng] = property.location
			.split(",")
			.map(Number) || [37.7749, -122.4194]

		if (!mapInstanceRef.current) {
			mapInstanceRef.current = new maplibregl.Map(
				{
					container: mapRef.current,
					style:
						"https://api.maptiler.com/maps/streets/style.json?key=MAPTILER_KEY",
					center: [lng, lat],
					zoom: 15,
				},
			)
		}

		if (markerRef.current) {
			markerRef.current.remove()
		}

		markerRef.current = new maplibregl.Marker()
			.setLngLat([lng, lat])
			.addTo(mapInstanceRef.current)

		return () => {
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove()
				mapInstanceRef.current = null
			}
		}
	}, [property.location])

	if (isLoading) {
		return (
			<div className="flex h-[300px] items-center justify-center rounded-lg bg-gray-100">
				<Loader className="h-6 w-6 animate-spin text-gray-400" />
			</div>
		)
	}

	return (
		<div
			ref={mapRef}
			className="h-[300px] w-full rounded-lg"
		/>
	)
}
