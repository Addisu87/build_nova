"use client"

import L from 'leaflet'

export const createPriceMarker = (price: number | undefined, isSelected: boolean = false) => {
  const formattedPrice = !price ? 'N/A' : price >= 1000000 
    ? `$${(price / 1000000).toFixed(1)}M` 
    : `$${(price / 1000).toFixed(0)}K`

  const markerHtml = `
    <div class="relative group">
      <div class="
        ${isSelected ? 'bg-blue-600' : 'bg-black'} 
        text-white px-2 py-1 rounded-lg shadow-lg
        transform transition-transform group-hover:scale-105
        font-semibold text-sm whitespace-nowrap
      ">
        ${formattedPrice}
      </div>
      <div class="
        ${isSelected ? 'border-blue-600' : 'border-black'}
        w-4 h-4 rotate-45 border-b-2 border-r-2
        absolute -bottom-2 left-1/2 -translate-x-1/2
        bg-transparent
      "></div>
    </div>
  `

  return L.divIcon({
    html: markerHtml,
    className: 'custom-price-marker',
    iconSize: L.point(40, 40),
    iconAnchor: L.point(20, 40)
  })
}