"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { usePropertyImages } from "@/hooks/properties/use-property-images"

interface PropertyGalleryProps {
  propertyId: string
  propertyType: string
}

export function PropertyGallery({ propertyId, propertyType }: PropertyGalleryProps) {
  const { listImages, isLoading } = usePropertyImages()
  const [images, setImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const folderPath = `properties/${propertyType.toLowerCase()}/${propertyId}`
        const imageResults = await listImages(folderPath)
        setImages(imageResults.map(img => img.url))
      } catch (error) {
        console.error("Error fetching property images:", error)
      }
    }

    fetchImages()
  }, [propertyId, propertyType, listImages])

  const showNext = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const showPrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 aspect-video relative rounded-lg overflow-hidden">
          <Image
            src={images[0] || '/placeholder.jpg'}
            alt="Main property image"
            fill
            className="object-cover cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
        {images.slice(1, 5).map((image, index) => (
          <div 
            key={image} 
            className="aspect-video relative rounded-lg overflow-hidden"
          >
            <Image
              src={image}
              alt={`Property image ${index + 2}`}
              fill
              className="object-cover cursor-pointer"
              onClick={() => {
                setCurrentImageIndex(index + 1)
                setIsModalOpen(true)
              }}
            />
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl">
          <div className="relative aspect-video">
            <Image
              src={images[currentImageIndex]}
              alt={`Property image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2"
              onClick={showPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={showNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
