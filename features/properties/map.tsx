"use client"

import { useEffect, useRef } from "react"
import { Loader } from "lucide-react"
import { Property } from "./types"

interface PropertyMapProps {
	property: Property
	isLoading?: boolean
}

export function PropertyMap({
	property,
	isLoading = false,
}: PropertyMapProps) {
	const mapRef = useRef<HTMLDivElement>(null)
	const map = useRef<google.maps.Map | null>(null)
	const marker =
		useRef<google.maps.Marker | null>(null)

	useEffect(() => {
		if (!mapRef.current || !property.location)
			return

		const initMap = async () => {
			const { Map } =
				(await google.maps.importLibrary(
					"maps",
				)) as google.maps.MapsLibrary
			const { Marker } =
				(await google.maps.importLibrary(
					"marker",
				)) as google.maps.MarkerLibrary

			const position = {
				lat: property.location.latitude,
				lng: property.location.longitude,
			}

			map.current = new Map(mapRef.current, {
				center: position,
				zoom: 15,
				mapId: "DEMO_MAP_ID",
				disableDefaultUI: true,
				clickableIcons: false,
			})

			marker.current = new Marker({
				map: map.current,
				position,
				title: property.title,
			})
		}

		initMap()

		return () => {
			if (marker.current) {
				marker.current.setMap(null)
			}
			if (map.current) {
				// @ts-ignore
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

	return (
		<div
			ref={mapRef}
			className="h-[300px] w-full rounded-lg"
		/>
	)
}
