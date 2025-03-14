interface PropertyMapProps {
    property: Property
    nearbyProperties?: Property[]
    height?: string
    isSelected?: boolean
    onMarkerClick: (propertyId: string) => void
}

export function PropertyMap({
    property,
    nearbyProperties = [],
    height = "h-[400px]",
    isSelected = false,
    onMarkerClick
}: PropertyMapProps) {
    return (
        <div className={`relative ${height}`}>
            <Map
                center={[property.location.latitude, property.location.longitude]}
                zoom={15}
                className="h-full w-full"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Main property marker */}
                <PriceMarker
                    property={property}
                    isSelected={true}
                    onClick={() => onMarkerClick(property.id)}
                />

                {/* Nearby property markers */}
                {nearbyProperties.map(prop => (
                    <PriceMarker
                        key={prop.id}
                        property={prop}
                        isSelected={false}
                        onClick={() => onMarkerClick(prop.id)}
                    />
                ))}
            </Map>
        </div>
    )
}

interface PriceMarkerProps {
    property: Property
    isSelected: boolean
    onClick: () => void
}

function PriceMarker({ property, isSelected, onClick }: PriceMarkerProps) {
    const formattedPrice = property.price >= 1000000 
        ? `$${(property.price / 1000000).toFixed(1)}M` 
        : `$${(property.price / 1000).toFixed(0)}K`

    return (
        <Marker
            position={[property.location.latitude, property.location.longitude]}
            icon={createPriceMarker(property.price, isSelected)}
            eventHandlers={{
                click: onClick
            }}
        >
            <Popup>
                <div className="p-2">
                    <img 
                        src={property.imageUrl} 
                        alt={property.title}
                        className="w-32 h-24 object-cover mb-2 rounded"
                    />
                    <p className="font-bold">{formattedPrice}</p>
                    <p className="text-sm">{property.bedrooms} beds • {property.bathrooms} baths</p>
                </div>
            </Popup>
        </Marker>
    )
}