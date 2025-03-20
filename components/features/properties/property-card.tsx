import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { formatPrice } from '@/lib/utils'
import type { Property } from '@/types/properties'

interface PropertyCardProps {
  property: Property
  variant?: 'default' | 'compact'
}

export function PropertyCard({ property, variant = 'default' }: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useAuth()
  const isFavorited = isFavorite(property.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(property.id)
  }

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="group relative rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 bg-white/80 hover:bg-white/90 dark:bg-gray-900/80 dark:hover:bg-gray-900/90"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-lg font-semibold">
              {formatPrice(property.price)}
            </span>
            <span className="text-sm text-muted-foreground">
              {property.property_type}
            </span>
          </div>

          <h3 className="mb-1 line-clamp-1 font-medium">{property.title}</h3>
          
          <p className="mb-2 line-clamp-1 text-sm text-muted-foreground">
            {property.address}
          </p>

          {variant === 'default' && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{property.bedrooms} beds</span>
              <span>{property.bathrooms} baths</span>
              <span>{property.square_feet.toLocaleString()} sq ft</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
