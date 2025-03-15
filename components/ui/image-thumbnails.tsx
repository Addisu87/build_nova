"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { ImageIcon } from "lucide-react"

interface ImageThumbnailsProps {
  images: string[]
  currentIndex: number
  onSelect: (index: number) => void
  title?: string
  className?: string
}

export function ImageThumbnails({
  images,
  currentIndex,
  onSelect,
  title,
  className,
}: ImageThumbnailsProps) {
  // Show only first 5 images in the grid
  const displayImages = images.slice(0, 5)

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-2", className)}>
      {/* Main large image */}
      <div className="md:col-span-2 relative h-full">
        <button
          onClick={() => onSelect(0)}
          className={cn(
            "relative w-full h-full",
            "hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-blue-500",
            currentIndex === 0 && "ring-2 ring-blue-500"
          )}
        >
          <Image
            src={images[0]}
            alt={`${title} - Main Image`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </button>
      </div>

      {/* Right side smaller images grid */}
      <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2">
        {displayImages.slice(1).map((image, idx) => {
          const actualIndex = idx + 1
          const isLastVisible = actualIndex === 4 && images.length > 5

          return (
            <button
              key={actualIndex}
              onClick={() => image && onSelect(actualIndex)}
              className={cn(
                "relative aspect-square w-full",
                "hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-blue-500",
                currentIndex === actualIndex && "ring-2 ring-blue-500"
              )}
            >
              <Image
                src={image}
                alt={`${title} - Image ${actualIndex + 1}`}
                fill
                className="object-cover rounded-lg"
                sizes="25vw"
              />
              {isLastVisible && images.length > 5 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                  <span className="text-white text-lg font-medium">
                    +{images.length - 4}
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}