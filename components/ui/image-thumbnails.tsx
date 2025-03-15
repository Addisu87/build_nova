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
  title = "Image",
  className
}: ImageThumbnailsProps) {
  if (!images?.length) return null

  // Create an array of 5 items, fill with actual images or placeholders
  const displayImages = Array(5).fill(null).map((_, index) => images[index] || null)

  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[600px] w-full",
      className
    )}>
      {/* Main large image */}
      <div className="md:col-span-2 h-full">
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
      <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
        {displayImages.slice(1).map((image, idx) => {
          const actualIndex = idx + 1
          const isLastVisible = actualIndex === 4 && images.length > 5

          return (
            <button
              key={actualIndex}
              onClick={() => image && onSelect(actualIndex)}
              className={cn(
                "relative w-full h-full group",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                image ? "hover:opacity-95" : "cursor-default bg-gray-100",
                currentIndex === actualIndex && "ring-2 ring-blue-500"
              )}
            >
              {image ? (
                <>
                  <Image
                    src={image}
                    alt={`${title} - Image ${actualIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {isLastVisible && images.length > 5 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-lg font-medium">
                        +{images.length - 4}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Photo {actualIndex + 1}</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}