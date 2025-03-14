"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MapPin } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { Property } from "@/types/properties"
import { cn } from "@/lib/utils"
import L from 'leaflet'
import { formatPrice } from '@/lib/utils'

interface PropertyMapProps {
    property: Property
    nearbyProperties?: Property[]
    height?: string
    isSelected?: boolean
    onMarkerClick?: (propertyId: string) => void
}

const createPriceMarker = (price: number, isSelected: boolean = false) => {
    const markerHtml = `
        <div class="flex flex-col items-center relative -translate-y-1/2">
            <div class="${cn(
                'flex items-center justify-center px-3 py-1.5',
                'rounded-full shadow-lg font-medium text-sm whitespace-nowrap',
                'transform transition-all duration-200',
                isSelected 
                    ? 'bg-primary text-white scale-110' 
                    : 'bg-white text-gray-900 hover:scale-105'
            )}">
                ${formatPrice(price)}
            </div>
            <svg 
                class="${cn(
                    'w-6 h-6 mt-1',
                    isSelected ? 'text-primary' : 'text-gray-900'
                )}"
                viewBox="0 0 24 24" 
                fill="currentColor"
            >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/>
                <circle cx="12" cy="10" r="3" fill="white"/>
            </svg>
        </div>
    `

    return L.divIcon({
        html: markerHtml,
        className: 'bg-transparent border-none',
        iconSize: [80, 45],
        iconAnchor: [40, 45],
        popupAnchor: [0, -45]
    })
}

const PropertyPopup = ({ property }: { property: Property }) => (
    <div className="p-2 min-w-[200px]">
        <div className="aspect-video w-full mb-2 overflow-hidden rounded-lg">
            <img 
                src={property.images[0]} 
                alt={property.title}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
            />
        </div>
        <div className="space-y-1">
            <p className="font-semibold text-lg">{formatPrice(property.price)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                {property.bedrooms} beds • {property.bathrooms} baths
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {property.address}
            </p>
        </div>
    </div>
)

export function PropertyMap({
    property,
    nearbyProperties = [],
    height = "h-[400px]",
    isSelected = false,
    onMarkerClick
}: PropertyMapProps) {
    if (!property.location) {
        return (
            <div className={cn(
                height,
                "bg-gray-100 dark:bg-gray-800 rounded-lg",
                "flex items-center justify-center"
            )}>
                <div className="text-center space-y-2">
                    <MapPin className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Location not available
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("relative rounded-lg overflow-hidden", height)}>
            <MapContainer
                center={[property.location.latitude, property.location.longitude]}
                zoom={15}
                className="h-full w-full"
                scrollWheelZoom={false}
                zoomControl={false} // We'll add custom zoom controls if needed
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                
                {/* Main property marker */}
                <Marker
                    position={[property.location.latitude, property.location.longitude]}
                    icon={createPriceMarker(property.price, isSelected)}
                    eventHandlers={{
                        click: () => onMarkerClick?.(property.id)
                    }}
                >
                    <Popup className="rounded-lg overflow-hidden">
                        <PropertyPopup property={property} />
                    </Popup>
                </Marker>

                {/* Nearby property markers */}
                {nearbyProperties.map((nearbyProperty) => (
                    nearbyProperty.location && (
                        <Marker
                            key={nearbyProperty.id}
                            position={[nearbyProperty.location.latitude, nearbyProperty.location.longitude]}
                            icon={createPriceMarker(nearbyProperty.price, false)}
                            eventHandlers={{
                                click: () => onMarkerClick?.(nearbyProperty.id)
                            }}
                        >
                            <Popup className="rounded-lg overflow-hidden">
                                <PropertyPopup property={nearbyProperty} />
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    )
}
