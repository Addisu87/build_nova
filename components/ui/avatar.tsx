"use client"

import * as React from "react"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: React.ReactNode
  size?: "sm" | "md" | "lg"
}

export function Avatar({
  src,
  alt = "User avatar",
  fallback,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          {fallback || <User className="h-5 w-5 text-gray-500" />}
        </div>
      )}
    </div>
  )
}