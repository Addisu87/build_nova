"use client"

import {
	useEffect,
	useRef,
	useState,
} from "react"
import { Loader } from "lucide-react"
import { Property } from "@/types/properties"
import { Loader as GoogleMapsLoader } from "@googlemaps/js-api-loader"

interface PropertyMapProps {
	property: Property
	isLoading?: boolean
}

export function PropertyMap({
	property,
	isLoading = false,
}: PropertyMapProps) {
	const mapRef = useRef<HTMLDivElement>(null)
	const [mapError, setMapError] = useState<string | null>(null)
	const map = useRef<any>(null)
	const marker = useRef<any>(null)

	useEffect(() => {
		if (!mapRef.current || !property.location)
			return

		const initMap = async () => {
			try {
				// Use the Google Maps Loader to load the API
				const loader = new GoogleMapsLoader({
					apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
					version: "weekly",
					libraries: ["maps", "marker"]
				})

				const google = await loader.load()
				
				// Default position (San Francisco)
				const defaultPosition = {
					lat: 37.7749,
					lng: -122.4194
				}
				
				// Since property.location is a string in the mock data,
				// we'll use a default position for demonstration
				const position = defaultPosition

				map.current = new google.maps.Map(mapRef.current, {
					center: position,
					zoom: 15,
					disableDefaultUI: true,
					clickableIcons: false,
				})

				marker.current = new google.maps.Marker({
					map: map.current,
					position,
					title: property.title,
				})
			} catch (error) {
				console.error("Error initializing Google Maps:", error)
				setMapError("Failed to load Google Maps. Please make sure you have set your API key.")
			}
		}

		initMap()

		return () => {
			if (marker.current) {
				marker.current.setMap(null)
			}
			if (map.current) {
				map.current = null
			}
		}
	}, [property.location, property.title])

	if (isLoading) {
		return (
			<div className="flex h-[300px] items-center justify-center rounded-lg bg-gray-100">
				<Loader className="h-6 w-6 animate-spin text-gray-400" />
			</div>
		)
	}

	if (mapError) {
		return (
			<div className="flex h-[300px] items-center justify-center rounded-lg bg-gray-100">
				<p className="text-red-500 text-center px-4">{mapError}</p>
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
