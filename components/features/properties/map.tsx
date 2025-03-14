"use client"

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Property } from "@/types/properties"
import { PropertyMapSkeleton } from "./map-skeleton"
import { createPriceMarker } from './map-marker'

interface PropertyMapProps {
  property: Property
  isLoading?: boolean
  className?: string
  height?: string
  onMarkerClick?: (property: Property) => void
  isSelected?: boolean
}

export function PropertyMap({
  property,
  isLoading = false,
  className = "",
  height = "h-[300px]",
  onMarkerClick,
  isSelected = false
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current || !property.location) return

    const { lat, lng } = property.location

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false, // Disable default zoom control
        scrollWheelZoom: false // Disable zoom on scroll
      }).setView([lat, lng], 15)

      // Add custom zoom control to top-right
      L.control.zoom({
        position: 'topright'
      }).addTo(mapInstanceRef.current)

      // Add tile layer with light theme
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap, ©CartoDB'
      }).addTo(mapInstanceRef.current)
    }

    if (markerRef.current) {
      markerRef.current.remove()
    }

    // Create marker with price label
    markerRef.current = L.marker([lat, lng], {
      icon: createPriceMarker(property.price, isSelected),
      riseOnHover: true
    }).addTo(mapInstanceRef.current)

    // Add popup with property details
    const popupContent = `
      <div class="p-2">
        <img src="${property.imageUrl}" alt="${property.title}" class="w-48 h-32 object-cover mb-2 rounded"/>
        <h3 class="font-semibold">${property.title}</h3>
        <p class="text-sm text-gray-600">${property.location.address}</p>
        <p class="text-sm">${property.bedrooms} beds • ${property.bathrooms} baths • ${property.area} sqft</p>
      </div>
    `

    markerRef.current.bindPopup(popupContent, {
      offset: L.point(0, -20),
      className: 'property-popup'
    })

    if (onMarkerClick) {
      markerRef.current.on('click', () => onMarkerClick(property))
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [property, isSelected, onMarkerClick])

  if (isLoading) {
    return <PropertyMapSkeleton className={className} height={height} />
  }

  return (
    <div
      ref={mapRef}
      className={`w-full rounded-lg ${height} ${className}`}
    />
  )
}