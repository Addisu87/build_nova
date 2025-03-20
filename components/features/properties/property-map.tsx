import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { createPriceMarker } from '@/lib/mapbox'
import type { Property } from '@/types/properties'

interface PropertyMapProps {
  properties?: Property[]
  center?: [number, number]
  zoom?: number
  onMarkerClick?: (property: Property) => void
  selectedProperty?: string
}

export function PropertyMap({
  properties = [],
  center = [-98.5795, 39.8283], // US center
  zoom = 4,
  onMarkerClick,
  selectedProperty
}: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom
    })

    const nav = new mapboxgl.NavigationControl()
    map.current.addControl(nav, 'top-right')

    return () => {
      map.current?.remove()
    }
  }, [])

  useEffect(() => {
    if (!map.current) return

    // Clear existing markers
    markers.current.forEach(marker => marker.remove())
    markers.current = []

    // Add new markers
    properties.forEach(property => {
      const marker = new mapboxgl.Marker({
        element: createPriceMarker(
          property.price,
          property.id === selectedProperty
        )
      })
        .setLngLat([property.longitude, property.latitude])
        .addTo(map.current!)

      if (onMarkerClick) {
        marker.getElement().addEventListener('click', () => {
          onMarkerClick(property)
        })
      }

      markers.current.push(marker)
    })
  }, [properties, selectedProperty, onMarkerClick])

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[400px] rounded-lg overflow-hidden"
    />
  )
}
