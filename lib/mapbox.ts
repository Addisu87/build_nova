import mapboxgl from "mapbox-gl"

// Initialize Mapbox with your access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

// Custom price marker creator using Tailwind classes
export const createPriceMarker = (price: number, isSelected: boolean = false) => {
	const formattedPrice =
		price >= 1000000
			? `$${(price / 1000000).toFixed(1)}M`
			: `$${(price / 1000).toFixed(0)}K`

	const markerElement = document.createElement("div")
	markerElement.className = "custom-price-marker"

	markerElement.innerHTML = `
    <div class="relative flex flex-col items-center">
      <div class="${
				isSelected
					? "bg-blue-600 text-white scale-110"
					: "bg-white text-gray-900 hover:scale-105"
			} px-3 py-2 rounded-lg shadow-md font-medium transition-all duration-200">
        ${formattedPrice}
      </div>
      ${
				isSelected
					? `
          <div class="mt-2 text-blue-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          `
					: ""
			}
    </div>
  `

	return markerElement
}
