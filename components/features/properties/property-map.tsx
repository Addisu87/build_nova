import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { createPriceMarker } from '@/lib/mapbox'
import type { Property } from '@/types'

interface PropertyMapProps {
  properties?: Property[]
  property?: Property // for single property view
  nearbyProperties?: Property[]
  center?: [number, number]
  zoom?: number
  height?: string
  isSelected?: boolean
  onMarkerClick?: (propertyId: string) => void
}

export function PropertyMap({
  properties,
  property,
  nearbyProperties = [],
  center,
  zoom = 14,
  height = "h-[400px]",
  isSelected = false,
  onMarkerClick
}: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return

    // If property is provided, use its location as center
    const initialCenter = center || (property ? 
      [property.longitude, property.latitude] as [number, number] : 
      [-98.5795, 39.8283] // US center
    )

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom: zoom
    })

    const nav = new mapboxgl.NavigationControl()
    map.current.addControl(nav, 'top-right')

    return () => {
      markers.current.forEach(marker => marker.remove())
      map.current?.remove()
    }
  }, [])

  // Update markers
  useEffect(() => {
    if (!map.current) return

    // Clear existing markers
    markers.current.forEach(marker => marker.remove())
    markers.current = []

    const allProperties = properties || (property ? [property, ...nearbyProperties] : [])

    // Add markers for all properties
    allProperties.forEach(prop => {
      const isMain = prop.id === property?.id
      const marker = new mapboxgl.Marker({
        element: createPriceMarker(prop.price, isMain)
      })
        .setLngLat([prop.longitude, prop.latitude])
        .addTo(map.current!)

      if (onMarkerClick) {
        marker.getElement().addEventListener('click', () => {
          onMarkerClick(prop.id)
        })
      }

      markers.current.push(marker)
    })

    // Fit bounds to include all properties
    if (allProperties.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      allProperties.forEach(prop => {
        bounds.extend([prop.longitude, prop.latitude])
      })

      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 14
      })
    }
  }, [properties, property, nearbyProperties, onMarkerClick])

  return (
    <div 
      ref={mapContainer} 
      className={`w-full ${height} rounded-lg overflow-hidden`}
    />
  )
}

function calculateCenter(properties: Property[]): [number, number] {
  const total = properties.reduce(
    (acc, prop) => ({
      lat: acc.lat + prop.latitude,
      lng: acc.lng + prop.longitude
    }),
    { lat: 0, lng: 0 }
  )

  return [
    total.lng / properties.length,
    total.lat / properties.length
  ]
}
