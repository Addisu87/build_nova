import { cn } from "@/lib/utils"

interface PropertyMapSkeletonProps {
  className?: string
  height?: string
}

export function PropertyMapSkeleton({
  className,
  height = "h-[300px]"
}: PropertyMapSkeletonProps) {
  return (
    <div className={cn(
      "w-full rounded-lg bg-gray-200 animate-pulse",
      height,
      className
    )} />
  )
} 