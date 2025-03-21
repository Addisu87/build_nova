import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { createPriceMarker } from '@/lib/mapbox'
import type { Property } from '@/types'

interface PropertyMapProps {
  property?: Property
  nearbyProperties?: Property[]
  center?: [number, number]
  zoom?: number
  height?: string
  isSelected?: boolean
  onMarkerClick?: (propertyId: string) => void
}

export function PropertyMap({
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

  // Handle markers
  useEffect(() => {
    if (!map.current) return

    // Clear existing markers
    markers.current.forEach(marker => marker.remove())
    markers.current = []

    // Add main property marker if it exists
    if (property) {
      const mainMarker = new mapboxgl.Marker({
        element: createPriceMarker(property.price, true)
      })
        .setLngLat([property.longitude, property.latitude])
        .addTo(map.current)

      if (onMarkerClick) {
        mainMarker.getElement().addEventListener('click', () => {
          onMarkerClick(property.id)
        })
      }

      markers.current.push(mainMarker)
    }

    // Add nearby properties markers
    nearbyProperties.forEach(nearbyProperty => {
      const marker = new mapboxgl.Marker({
        element: createPriceMarker(nearbyProperty.price, false)
      })
        .setLngLat([nearbyProperty.longitude, nearbyProperty.latitude])
        .addTo(map.current!)

      if (onMarkerClick) {
        marker.getElement().addEventListener('click', () => {
          onMarkerClick(nearbyProperty.id)
        })
      }

      markers.current.push(marker)
    })

    // Fit bounds to include all markers if there are multiple properties
    if (property && nearbyProperties.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      bounds.extend([property.longitude, property.latitude])
      
      nearbyProperties.forEach(prop => {
        bounds.extend([prop.longitude, prop.latitude])
      })

      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 14
      })
    }
  }, [property, nearbyProperties, onMarkerClick])

  return (
    <div 
      ref={mapContainer} 
      className={`w-full ${height} rounded-lg overflow-hidden`}
    />
  )
}
