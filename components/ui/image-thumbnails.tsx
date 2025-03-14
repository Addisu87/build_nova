"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

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

  return (
    <div className={cn("grid grid-cols-4 gap-2", className)}>
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={cn(
            "relative aspect-[4/3] overflow-hidden rounded-lg transition-all",
            "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
            currentIndex === index 
              ? "ring-2 ring-blue-500" 
              : "opacity-70 hover:opacity-100"
          )}
        >
          <Image
            src={image}
            alt={`${title} - Thumbnail ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 25vw, 20vw"
          />
        </button>
      ))}
    </div>
  )
}